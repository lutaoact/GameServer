var assert = require('assert');
var async = require('async');
var loadTestData = require('../lib/loadTestData');

var AsyncClass = new (require('../../lib/AsyncClass').AsyncClass);
var CardService = AsyncClass.service('CardService');

var userId = '111111111111111111111111';

describe('CardService', function() {
    describe('#levelUp()', function() {
        it('should run well', function(done) {
            runTest(done);
        });
    });
});

describe('CardService', function() {
    describe('#evo()', function() {
        it('should evo success', function(done) {
            runTest2(done);
        });
    });
});

function runTest2(done) {
    async.waterfall([
        function(next) {
            loadTestData('default', next);
        },
        function(data, next) {
            CardService.getUserCards(userId, next);
        },
        function(userCards, next) {
            var newUserCards = _.sortBy(userCards, 'card_id');
            CardService.evoUp(
                newUserCards[0]._id,
                [ newUserCards[1]._id, newUserCards[2]._id ],
                next
            );
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
            var newUserCards = _.shuffle(userCards);
            CardService.levelUp(
                userId,
                newUserCards[0]._id,
                [ newUserCards[1]._id, newUserCards[2]._id ],
                next
            );
        },
        function(res, next) {
            CardService.getUserCards(userId, next);
        },
    ], function(err, res) {
        assert.ifError(err);
        done();
    });
}
