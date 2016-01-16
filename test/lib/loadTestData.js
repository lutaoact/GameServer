require('../../lib/init').init();
var async = require('async');

function loadTestData(filename, cb) {
    async.auto({
        modelMap : function(next) {
            _u.makeAllModelMap(next);
        },
        testData : function(next) {
            var path = '../fixture/' + (filename ? filename : 'default');
            next(null, require(path));
        },
        saveData : ['modelMap', 'testData', function(next, res) {
            _u.saveData(res.modelMap, res.testData, next);
        }],
    }, function(err, res) {
        cb(err, res.testData);
    });
}
module.exports = loadTestData;
