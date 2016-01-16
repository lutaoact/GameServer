var assert = require('assert');
var async = require('async');
var loadTestData = require('../lib/loadTestData');

var AsyncClass = new (require('../../lib/AsyncClass').AsyncClass);
var TextService = AsyncClass.service('TextService');

describe('TextService', function() {
    describe('#add()', function() {
        it('should add success', function(done) {
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
            TextService.getAll(next);
        },
    ], function(err, res) {
        assert.ifError(err);
        done();
    });
}
