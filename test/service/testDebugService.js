var assert = require('assert');
var async = require('async');
var loadTestData = require('../lib/loadTestData');

var AsyncClass = new (require('../../lib/AsyncClass').AsyncClass);
var DebugService = AsyncClass.service('DebugService');
var CardService = AsyncClass.service('CardService');

var userId = '111111111111111111111111';

describe('DebugService', function() {
    describe('#add()', function() {
        it('should level up success', function(done) {
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
            CardService.getUserCards(userId, next);
        },
        function(userCards, next) {
            var newUserCards = _.shuffle(userCards);
            DebugService.levelUp(
                newUserCards[0]._id,
                3,
                next
            );
        },
    ], function(err, res) {
        assert.ifError(err);
        done();
    });
}
