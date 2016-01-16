var AsyncClass = require('../../lib/AsyncClass').AsyncClass;
var config = require('config');
var underscore = require('underscore');
var mongoose;
var models = {};
var convertToSnakeCase = require('../../lib/util').convertToSnakeCase;
var _s = require('underscore.string');
var time = require('../../lib/util').time;

exports.BaseModel = AsyncClass.subclass({
    classname : 'BaseModel',
    model: null,
    mongoose: null,
    schema: null,
    schemaParams: {},
    dbURL : '',

    initialize : function() {
        if(underscore.isEmpty(mongoose)){
            mongoose = require('mongoose');
            var dbURL = this.dbURL || config.mongodb.dbURL;
            var connection = mongoose.connect(dbURL).connection;

            var self = this;
            connection.on('error', function(err) {
                self.logF('connection error:' + err);
            });

            connection.once('open', function() {
                self.logI('open mongodb success');
            });
        }

        this.mongoose = mongoose;

        if (this.schema) {
            this.createModel(convertToSnakeCase(this.classname));
        }
    },

    createModel : function(name){
        if(!models[name]) {
            models[name] = mongoose.model(
                name, mongoose.Schema(this.schema, this.schemaParams)
            );
        }

        this.model = models[name];
        return this.model;
    },
    getSchema : function() {
        return this.schema;
    },

    newModel : function(data){
        if(!this.model) return null;

        return new this.model(data);
    },

    save : function(data, cb) {
        var now = time();
        if (this.schema.created_at) data.created_at = now;
        if (this.schema.updated_at) data.updated_at = now;

        var newData = this.newModel(data);
        newData.save(function(err, res) {
            cb(err, res);
        });
    },

    getSaveFunc : function(data) {
        return this.save.bind(this, data);
    },

    validate: function(data, cb) {
        var newData = this.newModel(data);
        newData.validate(cb);
    },

    findAll : function(cb) {
        this.model.find.apply(this.model, [{}].concat(_.toArray(arguments)));
    },

    findOne : function() {
        this.model.findOne.apply(this.model, arguments);
    },

    find : function() {
        this.model.find.apply(this.model, arguments);
    },

    findById : function() {
        this.model.findById.apply(this.model, arguments);
    },

    /*
     * @description Return result as hash
     * // return { 2 : { id: 1, id2: 2 } }
     * Model.findIndexBy("id2", conditions, function(err, map) {...});
     */
    findIndexBy : function() {
        var index = Array.prototype.shift.apply(arguments);
        var callback = arguments[arguments.length - 1];
        arguments[arguments.length - 1] = function(err, list) {
            callback(err, _.indexBy(list, index));
        };
        this.find.apply(this, arguments);
    },

    update : function() {
        this.model.update.apply(this.model, arguments);
    },

    where : function() {
        this.model.$where.apply(this.model, arguments);
    },

    geoNear : function() {
        this.model.geoNear.apply(this.model, arguments);
    },

    remove : function(where, cb) {
        this.model.remove(where, cb);
    },

    findOneAndUpdate : function(){
        this.model.findOneAndUpdate.apply(this.model, arguments);
    },

    findByIdAndUpdate : function(){
        this.model.findByIdAndUpdate.apply(this.model, arguments);
    },
    /*
     * 描述：添加可扩展的key
     * length可以是整数，也可以是包含M和N两个key的对象
     */
    addExtensibleKeyForSchema: function(key, length, value) {
        if (typeof length === typeof {}) {
            for (var i = 1; i <= length.N; i++) {
                for (var j = 1; j <= length.M; j++) {
                    this.schema[_s.sprintf(key, i, j)] = value;
                }
            }
        } else if (typeof length === typeof 0) {
            for (var i = 1; i <= length; i++) {
                this.schema[_s.sprintf(key, i)] = value;
            }
        } else {
            console.error(__filename + ': length must be wrong');
        }
    },

    /*
     * 本地缓存相关操作
     */
    $findCache: function(key, func, cb) {
        var data = LocalCache.get(key);
        if (data) {
            logger.info('Get from LOCAL cache: '+key);
            cb(null, data);
            return;
        }

        this.waterfall([
            function(next) {
                func.call(this, next);
            },
            function(result, next) {
                LocalCache.put(key, result);
                next(null, result);
            },
        ], cb);
    },
});
