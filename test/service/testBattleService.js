var assert = require('assert');
var async = require('async');
var loadTestData = require('../lib/loadTestData');

var AsyncClass = new (require('../../lib/AsyncClass').AsyncClass);
var BattleService = AsyncClass.service('BattleService');

describe('BattleService', function() {
    describe('#startBattle()', function() {
        it('should add success', function(done) {
            runTest(done);
        });
    });

});

function runTest(done) {
    var Room = AsyncClass.model('Room');
    async.waterfall([
        function(next) {
            var room = {
                status : 0,
            };
            Room.save(room, next);
        },
        function(room, next) {
            Room.findOne({}, next);
        },
        function(res, next){
            BattleService.startBattle(
                res._id,
                next
            );
        },

    ], function(err, res) {
//        console.log(res.length);
        assert.ifError(err);
        done();
    });
}


