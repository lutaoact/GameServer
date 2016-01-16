var BaseController = require('./BaseController').BaseController;

exports.MissionController = BaseController.subclass({
    classname: 'MissionController',

    getAreaUserMissions : function(request, response) {
        var userId = request.param('user_id');
        var areaId = request.param('area_id');

        var MissionService = this.service('MissionService');

        this.series({
            areaUserMissions : function(next) {
                MissionService.getAreaUserMissions(userId, areaId, next);
            },
        }, function(err, res) {
            response.sendErrorOrResult(
                err, {area_user_missions : res.areaUserMissions}
            );
        });
    },

    startMission : function(request, response) {
        var userId    = request.param('user_id');
        var missionId = request.param('mission_id');
        var userCardIds = JSON.parse(request.param('user_card_ids'));
        var UserService = this.service('UserService');

        this.series({
            startMission : function(next) {
                MissionService.startMission(
                    userId, missionId, userCardIds, next
                );
            },
            user : function(next) {
                UserService.getUser(userId, next);
            },
        }, function(err, res) {
            response.sendErrorOrResult(err, {user: res.user});
        });
    },

    finishMission: function(request, response){
        var userId    = request.param('user_id');
        var missionId = request.param('mission_id');
        var userCardIds = JSON.parse(request.param('user_card_ids'));

        var MissionService = this.service('MissionService');
        this.series({
            finishMission : function(next) {
                MissionService.finishMission(
                    userId, missionId, userCardIds, next
                );
            },
        }, function(err, res) {
            response.sendErrorOrResult( err, res.finishMission.rewards);
        });
    },
});

exports.routes = {
    GET : {
        '/api/finish_mission' : exports.MissionController.createAction('finishMission'),
        '/api/get_area_user_missions' : exports.MissionController.createAction('getAreaUserMissions'),
    },
    POST: {
        '/api/finish_mission' : exports.MissionController.createAction('finishMission'),
        '/api/get_area_user_missions' : exports.MissionController.createAction('getAreaUserMissions'),
    },
};
