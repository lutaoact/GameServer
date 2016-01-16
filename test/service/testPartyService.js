var assert = require('assert');
var async = require('async');
var loadTestData = require('../lib/loadTestData');

var AsyncClass = new (require('../../lib/AsyncClass').AsyncClass);
var PartyService = AsyncClass.service('PartyService');
var CardService = AsyncClass.service('CardService');
var userId = '111111111111111111111111';
var userId2 = '111111111111111111111112';

describe('PartyService', function() {
    describe('#add()', function() {
        it('should add success', function(done) {
            runTest(done);
        });
    });
});

describe('PartyService', function() {
    describe('#getFriendCardList()', function() {
        it('should add success', function(done) {
            runTest2(done);
        });
    });
});

function buildUpdateObject(userCardIds) {
    var obj = {}, userCardIdsLength = 4, key = 'user_card%d_id';
    for (var i = 1; i <= userCardIdsLength; i++) {
        var currentKey = _s.sprintf(key, i);
        obj[currentKey] =  userCardIds[i-1];
    }
    return obj;
}

function runTest2(done) {
    async.waterfall([
        function(next) {
            loadTestData('default', next);
        },
        function(data, next) {
            CardService.getUserCards(userId, next);
        },
        function(userCards, next) {
            var userCardIds = _.pluck(userCards, '_id');

            PartyService.setUserCardParty(
                userId,
                1,
                buildUpdateObject(userCardIds),
                next
            );
        },
        function(res, next) {
            PartyService.getFriendCardList(userId2, next);
        },
    ], function(err, res) {
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
            CardService.getUserCards(userId, next);
        },
        function(userCards, next) {
            var userCardIds = _.pluck(userCards, '_id');
            PartyService.setUserCardParty(
                userId,
                1,
                buildUpdateObject(userCardIds),
                next
            );
        },
    ], function(err, res) {
        assert.equal(res.upsert._id.toString().length, 24);
        assert.ifError(err);
        done();
    });
}
