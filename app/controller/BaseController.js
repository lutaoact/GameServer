var AsyncClass = require('../../lib/AsyncClass').AsyncClass;
var Random = require('../../lib/mt').MersenneTwister;

exports.BaseController = AsyncClass.subclass({
    classname: 'BaseController',

    $createAction: function(funcName) {
        var self = this;

        return function(req, res) {
            var rand = new Random();
            var o = new self();
            o.rId = rand.nextInt(1000);//requestId
            o[funcName](req, res);
        }.bind(self);
    },

});

exports.routes = {

};
