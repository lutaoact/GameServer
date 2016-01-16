var assert = require('assert');
var async = require('async');
var loadTestData = require('../lib/loadTestData');

var AsyncClass = new (require('../../lib/AsyncClass').AsyncClass);
var MissionService = AsyncClass.service('MissionService');

describe('MissionService', function() {
    describe('#startMission()', function() {
        it('should add success', function(done) {
            runStartMission(done);
        });
    });
});

describe('MissionService', function() {
    describe('#finishMission()', function() {
        it('should add success', function(done) {
            runTest(done);
        });
    });
});

var userId = '111111111111111111111111';

function runStartMission(done) {
    async.waterfall([
        function(next) {
            loadTestData('default', next);
        },
        function(data, next) {
            var UserCard = AsyncClass.model('UserCard');
            UserCard.findOne({}, next);
        },
        function(userCard, next) {
            MissionService.startMission(userId, 100, [userCard._id], next);
        },
    ], function(err, res) {
//        logger.info(err, res);
        assert.ifError(err);
        done();
    });
}

function runTest(done) {
    async.waterfall([
        function(next) {
            loadTestData('default', next);
        },
        function(data, next) {
            var UserCard = AsyncClass.model('UserCard');
            UserCard.findOne({}, next);
        },
        function(userCard, next) {
            MissionService.finishMission(userId, 100, [userCard._id], next);
        },
    ], function(err, res) {
        assert.ifError(err);
        assert.ok(res.rewards);
        done();
    });
}
