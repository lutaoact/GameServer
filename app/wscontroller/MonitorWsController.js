var WSController = require('./WSController').WSController;

exports.BattleController = WSController.subclass({
    classname : 'BattleController',

    hello : function(request) {
        setTimeout(
            function(){
            this.sendMessageToMembers(
                request.url, request.params,
                null, [request.params.user_id]
            )
            }.bind(this),
            1
        );
    },

    pulse : function(request) {
        var userId = request.params.user_id;
        global.sockets[userId].pulseTime = _u.time();
        this.sendMessageToMembers(
                request.url, request.params,
                null, [userId]
        );
    },

});

exports.routes = {
    '/ws/hello' : exports.BattleController.createAction('hello'),
    '/ws/pulse' : exports.BattleController.createAction('pulse'),
};
