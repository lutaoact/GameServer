var WSController = require('./WSController').WSController;

exports.RoomController = WSController.subclass({
    classname : 'RoomController',

    joinRoom : function(request) {
        var userId = request.params.user_id;
        var roomId = request.params.room_id;

        var RoomService = this.service('RoomService');
        this.series({
            room : function(next) {
                RoomService.getRoomById(roomId, next);
            },
            checkCondition : function(next, res) {
                RoomService.canJoin(res.room, userId, next);
            },
            addToSet : function(next, res) {
                RoomService.addMember(roomId, userId, next);
            },
            memberUsers : function(next, res) {
                RoomService.appendRoomMemberUser(res.room, userId, next);
            },
            sendMsg : function(next, res) {
                global.sockets[userId].roomId = roomId;
                var allMembers =  _.union(res.room.members, [userId]);
                this.sendMessageToMembers(
                    request.url, { members : res.memberUsers },
                    null, allMembers
                );
                logger.info(JSON.stringify(request));
                next();
            },
        }, function(err, res) {
            if (err) {
                this.sendMessageToMember(
                    request.url, request.params, err, request.params.user_id
                );
                logger.error(err);
                logger.info("can't join room:" + JSON.stringify(request));
            }
        });
    },

    leaveRoom : function(request) {
        global.sockets[request.params.user_id].webSocket.close();
    },

    doLeaveRoom : function(request) {
        var userId = request.params.user_id;
        var roomId = request.params.room_id;

        var RoomService = this.service('RoomService');

        this.series({
            deleteMember : function(next) {
                RoomService.deleteMember(roomId, userId, next);
            },
            sendMessage : function(next, res) {
                this.sendMessageToRoomOtherMembers(
                    request.url,
                    request.params,
                    roomId,
                    userId
                );
                logger.info(JSON.stringify(request));
            },
        }, function(err, res) {
            if (err) logger.error(err);
        });
    },
});

exports.routes = {
    '/ws/join_room' : exports.RoomController.createAction('joinRoom'),
    '/ws/leave_room' : exports.RoomController.createAction('leaveRoom'),
    '/ws/do_leave_room' : exports.RoomController.createAction('doLeaveRoom'),
};
