var BaseController = require('./BaseController').BaseController;
var ErrCode = require('../../lib/ErrCode');

exports.DataController = BaseController.subclass({
    classname: 'DataController',

    initialize: function($super) {
        $super();
    },

    getMasterData: function(request, response) {
        var DataService = this.service('DataService');
        this.series({
            data: function(next) {
                DataService.getMasterData(next);
            },
            systemText : function(next) {
                DataService.getSystemText(next);
            },
        }, function(err, res) {
            res.data.system_text = res.systemText;
            response.sendErrorOrResult(err, res.data);
        });
    },

});

exports.routes = {
    GET : {
        '/api/get_master_data' : exports.DataController.createAction('getMasterData'),
    },
    POST: {
        '/api/get_master_data' : exports.DataController.createAction('getMasterData'),
    },
};
