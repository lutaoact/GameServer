require('../lib/init').init();
var async = require('async');

var database = require('../public/master_data.json');
var DataVersion = require('../app/model/DataVersion').DataVersion;

async.waterfall([
    function(next) {
        _u.makeAllModelMap(next);
    },
    function(map, next) {
        _u.saveData(map, database, next);
    },
    function(next) {
        logger.info(">>>>> finished all the table <<<<<");
//        (new DataVersion).increment(next);
        next();
    },
], function(err) {
    if (err) {
        logger.error(err);
        process.exit(1);
    }
    process.exit(0);
});
