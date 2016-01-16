var AsyncClass = require('../../lib/AsyncClass').AsyncClass;
var ErrCode = require('../../lib/ErrCode');

exports.WSController = AsyncClass.subclass({
    classname : 'WSController',

    $createAction : function(funcName) {
        var self = this;
        return function(req) {
            var o = new self();
            o[funcName](req);
        }.bind(self);
    },

    sendMessageToRoomAllMembers: function(url, params, roomId) {
        var RoomService = this.service('RoomService');
        this.series({
            members : function(next) {
                RoomService.getRoomAllMembersFromCache(roomId, next);
            },
        }, function(err, res) {
            this.sendMessageToMembers(
                url, params,
                err,
                res.members
            );
        });
    },

    sendMessageToRoomOtherMembers: function(url, params, roomId, senderId) {
        var RoomService = this.service('RoomService');
        this.series({
            members : function(next) {
                RoomService.getRoomAllMembersFromCache(roomId, next);
            },
        }, function(err, res) {
            var otherMembers = _.without(res.members, senderId);
            this.sendMessageToMembers(
                url, params,
                err,
                otherMembers
            );
        });
    },

    sendMessageToMembers : function(url, params, err, userIds) {
        var message = this.buildMessage(url, params, err);
        this.sendToMembers(message, userIds);
    },

    sendMessageToMember : function(url, params, err, userId) {
        var message = this.buildMessage(url, params, err);
        this.sendToMember(message, userId);
    },

    sendToMembers : function(message, userIds) {
        _.each(userIds, function(userId) {
            this.sendToMember(message, userId);
        }.bind(this));
    },

    sendToMember : function(message, userId) {
        if (!global.sockets[userId]) {
            logger.warn('socket does not exist: ' + userId);
            return;
        }
        global.sockets[userId].webSocket.send(message);
    },

    $buildMessage : function(url, params, err) {
        var util = require('util');
        if (err) {
            return JSON.stringify({
                url: url,
                params : params,
                err_code : err.err_code || ErrCode.UnexpectedSystemError,
                err_msg : util.inspect(err),
            });
        } else {
            return JSON.stringify({
                url: url,
                params : params,
                err_code : 0,
                err_msg : '',
            });
        }
    },
});

exports.routes = {
};
