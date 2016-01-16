var _ = require('underscore');
var _s = require('underscore.string');
var FileUtils = require('fileutils');
var async = require('async');
var region = process.env.NODE_ENV ? process.env.NODE_ENV.substr(0, 2) : 'cn';
var textMap = require('../config/' + region + '/text');

/*
 * @param  [String] key textMap中指定的key
 * @param  [Array]  用于替换占位符的参数，可以为空
 * @return [String] 替换结果
 */
function getText(key, params) {
    if (!params) return textMap[key];

    return _s.sprintf.apply(_s, [textMap[key]].concat(params));
}
exports.getText = getText;

/*
 * @desc 将字符串编码为bytes
 *
 * @param  [String] str 需要编码的字符串
 * @return [Buffer] 编码后的bytes
 */
function encode(str) {
    return new Buffer(_.map(new Buffer(str), function(b) {
        return encodeByte(b);
    }));
}
exports.encode = encode;

/*
 * @desc bytes解码为相应的字符串
 *
 * @param  [Buffer] buf 待解码的bytes
 * @return [String] 解码后的字符串
 */
function decode(buf) {
    return new Buffer(_.map(buf, function(b) {
        return decodeByte(b);
    })).toString();
}
exports.decode = decode;

/*
 * @desc 对单字节整数进行编解码
 *
 * @param  [Integer] b 8位整数[0-255]
 * @return [Integer] 编解码后的值，8位整数[0-255]
 */
function encodeByte(b) {
    return (b & 1 << 7) >> 7 | (b << 1 & 0xff);
}

function decodeByte(b) {
    return (((1 & b) << 7) | (b & 0xff) >> 1);
}

/*
 * @param  [Array] array   一个包含对象的数组
 * @param  [Array] columns 需要从对象中拣选出的属性名
 * @return [Array] 数组array的拷贝，其中的对象只包含columns中指定的那些列
 */
function arrayPick(array, columns) {
    return _.map(array, function(element) {
        return _.pick.apply(_, [element].concat(columns));
    });
}
exports.arrayPick = arrayPick;

/*
 * @param  [Array] array   一个包含对象的数组
 * @param  [Array] columns 需要从对象中忽略的属性名
 * @return [Array] 数组array的拷贝，其中的对象不包含columns中指定的那些列
 */
function arrayOmit(array, columns) {
    return _.map(array, function(element) {
        return _.omit.apply(_, [element].concat(columns));
    });
}
exports.arrayOmit = arrayOmit;

/*
 * @return [Integer] 当前的unix timestamp
 */
function time(date) {
    if(date) {
        return new Date(date).getTime() / 1000 | 0;
    } else {
        return new Date().getTime() / 1000 | 0;
    }
}
exports.time = time;

/*
 * @return [Integer] 当前的以毫秒为单位的时间戳
 */
function milliseconds() {
    return new Date().getTime();
}
exports.milliseconds = milliseconds;

/*
 * @param  [String] key 下划线分隔的字符串
 * @return [String] 每个单词首字母大写
 * @example user_card -> UserCard
 */
function convertToCamelCase(key) {
    return _.map(key.split('_'), function(s) {
        return s.charAt(0).toUpperCase() + s.substr(1);
    }).join('');
}
exports.convertToCamelCase = convertToCamelCase;

/*
 * @param  [String] key 每个单词首字母大写
 * @return [String] 下划线分隔
 * @example UserCard -> user_card
 */
function convertToSnakeCase(key) {
    return _.map(key.match(/[A-Z][a-z0-9]+/g), function(s) {
        return s.charAt(0).toLowerCase() + s.substr(1);
    }).join('_');
}
exports.convertToSnakeCase = convertToSnakeCase;

function makeModelMapBy(filenameRegex, cb) {
    var map = {};
    FileUtils.eachFileMatching(
        filenameRegex,
        './app/model',
        function(err, file, stat) {
            var modelName = file.replace(/^.*\/(.*).js/, "$1");
            if (modelName == 'BaseModel') return;

            map[modelName] = new (require('../' + file)[modelName]);
        },
        function(err, files, stats) {
            cb(null, map);
        }
    );
}

function makeAllModelMap(cb) {
    makeModelMapBy(/.js$/, cb);
}
exports.makeAllModelMap = makeAllModelMap;

function makeDynamicModelMap(cb) {
    makeModelMapBy(/User.*.js$/, cb);
}
exports.makeDynamicModelMap = makeDynamicModelMap;

function addExtensibleKeyFor(obj, key, length, value) {
    for (var i = 1; i <= length; i++) {
        obj[_s.sprintf(key, i)] = value;
    }
}
exports.addExtensibleKeyFor = addExtensibleKeyFor;

function saveData(modelMap, database, cb) {
    async.eachSeries(_.keys(database), function(table, next) {
        logger.info(">>>>> processing table " + table + " <<<<<");
        var modelName = convertToCamelCase(table);
        var Model = modelMap[modelName];
        if (!Model) {
            logger.error('can not find model: ' + modelName);
            next();
            return;
        }
        saveSpecifiedModelData(database[table], Model, next);
    }, cb);
}
exports.saveData = saveData;

//存储指定model的数据，只存储schema中指定的字段
function saveSpecifiedModelData(datas, modelObj, cb) {
    var schema = modelObj.schema;
    async.series([
        function(next) {
            modelObj.remove({}, next);
        },
        function(next) {
            var timeReg = /^\s*\d{4}-\d{2}-\d{2} \d{2}:\d{2}\s*$/;
            async.eachSeries(datas, function(d, _next) {
                var data = {};
                LOOP:
                for (var field in schema) {
                    if (_.isUndefined(d[field])) {
                        logger.error('no field: ' + field);
                        continue LOOP;
                    }
                    if (timeReg.test(d[field])){
                        d[field] = time(d[field]);
                    }
                    data[field] = d[field];
                }
                modelObj.save(data, _next);
            }, next);
        },
    ], cb);
}
exports.saveSpecifiedModelData = saveSpecifiedModelData;
