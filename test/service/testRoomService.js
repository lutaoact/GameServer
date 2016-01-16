var assert = require('assert');
var async = require('async');
var loadTestData = require('../lib/loadTestData');

var AsyncClass = new (require('../../lib/AsyncClass').AsyncClass);
var RoomService = AsyncClass.service('RoomService');

var userId = '111111111111111111111111';

describe('RoomService', function() {
    describe('#addRoom()', function() {
        it('should add success', function(done) {
            runTest(done);
        });
    });

//    describe('#findRoom()', function() {
//        it('should not return null', function(done) {
//            runTest2(done);
//        });
//    });
//
//    describe('#setRoomStatus()', function() {
//        it('should not return null', function(done) {
//            runTest3(done);
//        });
//    });
//    describe('#appendRoomMemberUser()', function() {
//        it('should not return null', function(done) {
//            runTest4(done);
//        });
//    });

});

//function runTest4(done) {
//    async.waterfall([
//        function(next) {
//            var RoomModel = AsyncClass.model('Room');
//            RoomModel.findOne({}, next);
//        },
//        function(res, next) {
//            RoomService.appendRoomMemberUser(res, userId, next);
//        },
//    ], function(err, res) {
////        console.log(res.length);
//        assert.ifError(err);
//        done();
//    });
//}
//
//function runTest3(done) {
//    async.waterfall([
//        function(next) {
//            var RoomModel = AsyncClass.model('Room');
//            RoomModel.findOne({}, next);
//        },
//        function(res, next) {
//            RoomService.setRoomStatus(
//                res._id,
//                Const.RoomStatus.Waiting,
//                next
//            );
//        },
//    ], function(err, res) {
////        console.log(res.length);
//        assert.ifError(err);
//        done();
//    });
//}
//
//function runTest2(done) {
//    async.waterfall([
//        function(next) {
//            RoomService.findNearValiadRoomsWithHostName([50, 50], next);
//        },
//    ], function(err, res) {
////        console.log(res.length);
//        assert.ifError(err);
//        done();
//    });
//}
Room = AsyncClass.model('room');

function runTest(done) {
    async.waterfall([
        function(next) {
          Room.save({_id: userId}. mext);
        },
    ], function(err, res) {
        assert.ifError(err);
        done();
    });
}
