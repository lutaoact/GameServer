var BaseController = require('./BaseController').BaseController;
var ErrCode = require('../../lib/ErrCode');

exports.DemoController = BaseController.subclass({
    classname: 'DemoController',
    a:1,

    hello: function(request, response) {
        response.sendResult({'hello': '中国'});
    },

    abc: function(request, response) {
        this.logI('I am in abc');
        this.a++;
        response.sendResult("a=" + this.rId);
    },
});

exports.routes = {
    GET : {
        '/api/hello' : exports.DemoController.createAction('hello'),
        '/api/abc': exports.DemoController.createAction('abc'),
    },
    POST: {
        '/api/hello': exports.DemoController.createAction('hello'),
        '/api/abc': exports.DemoController.createAction('abc'),
    },
};
