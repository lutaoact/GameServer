var WSController = require('./WSController').WSController;

exports.BattleController = WSController.subclass({
    classname : 'BattleController',

    battleSendMessage : function(request) {
        var userId  = request.params.user_id;
        var roomId  = request.params.room_id;
        var message = request.params.message;

        this.sendMessageToRoomOtherMembers(
            request.url,
            request.params,
            roomId,
            userId
        );
    },

    battleFinish : function(request) {
        var userId = request.params.user_id;
        var roomId = request.params.room_id;
        var BattleService = this.service('BattleService');

        this.series({
            finishBattle : function(next) {
                BattleService.finishBattle(roomId, next);
            },
        }, function(err, res) {
            this.sendMessageToRoomOtherMembers(
                request.url,
                request.params,
                roomId,
                userId
            );
        });
    },

    battleStart : function(request) {
        var userId = request.params.user_id;
        var roomId = request.params.room_id;
        var BattleService = this.service('BattleService');

        this.series({
            startBattle : function(next) {
                BattleService.startBattle(roomId, next);
            },
        }, function(err, res) {
            this.sendMessageToRoomOtherMembers(
                request.url,
                request.params,
                roomId,
                userId
            );
        });
    },

    battleSetArrow : function(request) {
        this.sendMessageToRoomOtherMembers(
            request.url, request.params,
            request.params.room_id, request.params.user_id
        );
    },

    battleStartShoot : function(request) {
        this.sendMessageToRoomOtherMembers(
            request.url, request.params,
            request.params.room_id, request.params.user_id
        );
    },

    battleUseSkill : function(request) {
        this.sendMessageToRoomOtherMembers(
            request.url, request.params,
            request.params.room_id, request.params.user_id
        );
    },

    battleFinishShoot : function(request) {
        this.sendMessageToRoomOtherMembers(
            request.url, request.params,
            request.params.room_id, request.params.user_id
        );
    },

});

exports.routes = {
    '/ws/battle_send_message' : exports.BattleController.createAction('battleSendMessage'),
    '/ws/battle_start' : exports.BattleController.createAction('battleStart'),
    '/ws/battle_set_arrow' : exports.BattleController.createAction('battleSetArrow'),
    '/ws/battle_start_shoot' : exports.BattleController.createAction('battleStartShoot'),
    '/ws/battle_finish' : exports.BattleController.createAction('battleFinish'),
    '/ws/battle_use_skill' : exports.BattleController.createAction('battleUseSkill'),
    '/ws/battle_finish_shoot' : exports.BattleController.createAction('battleFinishShoot'),
};
