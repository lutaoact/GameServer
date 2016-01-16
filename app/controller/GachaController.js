var BaseController = require('./BaseController').BaseController;

exports.GachaController = BaseController.subclass({
    classname: 'GachaController',

    show: function(request, response) {
        var userId = request.param('user_id');
        var GachaService = this.service('GachaService');

        this.series({
            gachaIds: function(next) {
                GachaService.show(userId, next);
            },
        }, function(err, res) {
            response.sendErrorOrResult(err, res.gachaIds);
        });
    },
});

exports.routes = {
    GET : {
        '/api/gacha_show' : exports.GachaController.createAction('show'),
    },
    POST: {
        '/api/gacha_show' : exports.GachaController.createAction('show'),
    },
};
