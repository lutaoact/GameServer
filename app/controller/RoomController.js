var BaseController = require('./BaseController').BaseController;
var RoomMaxNum = require('../../lib/Const').RoomMaxNum;

exports.RoomController = BaseController.subclass({
    classname: 'RoomController',

    createRoom : function(request, response) {
        var userId = request.param('user_id');
        var gps = JSON.parse(request.param('gps'));
        var maxNum = request.param('max_num') || RoomMaxNum;
        logger.info(userId, gps);

        var RoomService = this.service('RoomService');
        this.series({
            room : function(next) {
                RoomService.addRoom(userId, gps, maxNum, next);
            },
        }, function(err, res) {
            response.sendErrorOrResult(err, res);
        });
    },


    findRoom : function(request, response) {
        var gps = JSON.parse(request.param('gps'));
        var RoomService = this.service('RoomService');

        this.series({
            rooms: function(next) {
                RoomService.findNearValiadRoomsWithHostName(gps, next);
            },
        }, function(err, res) {
            response.sendErrorOrResult(err, res);
        });
    },
});

exports.routes = {
    GET : {
        '/api/create_room' : exports.RoomController.createAction('createRoom'),
        '/api/find_room' : exports.RoomController.createAction('findRoom'),
    },
    POST: {
        '/api/create_room' : exports.RoomController.createAction('createRoom'),
        '/api/find_room' : exports.RoomController.createAction('findRoom'),
    },
};
