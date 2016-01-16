require('../lib/init').init();
var async = require('async');
var region = process.env.NODE_ENV ? process.env.NODE_ENV.substr(0, 2) : 'cn';
var textMap = require('../config/' + region + '/text');
var Text = new (require('../app/model/Text').Text);

async.waterfall([
    function(next) {
        buildDatas(textMap, next);
    },
    function(datas, next) {
        _u.saveSpecifiedModelData(datas, Text, next);
    },
], function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    logger.info("import success");
    process.exit(0);
});

function buildDatas(textMap, cb) {
    var results = _.map(_.keys(textMap), function(key) {
        return {'key' : key, 'value' : textMap[key]};
    });
    cb(null, results);
}
