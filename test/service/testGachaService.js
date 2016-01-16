var assert = require('assert');
var async = require('async');
var loadTestData = require('../lib/loadTestData');

var AsyncClass = new (require('../../lib/AsyncClass').AsyncClass);
var GachaService = AsyncClass.service('GachaService');
var userId = '111111111111111111111111';

describe('GachaService', function() {
    describe('#show()', function() {
        it('should run well', function(done) {
            runTest(done);
        });
    });
});

function runTest(done) {
    async.waterfall([
        function(next) {
            loadTestData('default', next);
        },
        function(data, next) {
            GachaService.show(userId, next);//add what you need here
        },
    ], function(err, res) {
        assert.ifError(err);
        done();
    });
}
