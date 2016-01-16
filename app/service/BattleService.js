var BaseService = require('./BaseService').BaseService;

exports.BattleService = BaseService.subclass({
    classname: 'BattleService',

    startBattle : function(roomId, cb){
        var RoomService = this.service('RoomService');
        RoomService.setRoomStatus(
            roomId,
            Const.RoomStatus.Playing,
            cb
        );
    },

    finishBattle : function(roomId, cb){
        var RoomService = this.service('RoomService');
        RoomService.setRoomStatus(
            roomId,
            Const.RoomStatus.Closed,
            cb
        );
    },

});
