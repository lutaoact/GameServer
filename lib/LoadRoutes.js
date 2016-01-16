var FileUtils = require('fileutils');
var config = require('config');

module.exports = function(app) {
    var pathRegex = /Controller.js$/;
    FileUtils.eachFileMatching(
        pathRegex,
        './app/' + config.env + 'controller',
        function(err, file, stat) {
            var controllerName = file.replace(/^.*\/(.*).js/, "$1");
            var routes = require('../' + file).routes;
            addRoutes(app, routes);
        },
        function(err, files, stats) {
        }
    );
}

function addRoutes(app, routes) {
    for (var method in routes) { // POST or GET
        var map = routes[method]; // key => function(req, res)

        for (var key in map) {
            app[method.toLowerCase()](key, map[key]);
            logger.info("createAction " + method + " " + key);
        }
    }
}

var prototype = require('http').ServerResponse.prototype;
prototype.sendResult = function(result) {
//    this.send(_u.decode(_u.encode(JSON.stringify({
//        'err_code' : 0,
//        'err_msg'  : '',
//        'result'   : result,
//    }))));
//    this.send(_u.encode(JSON.stringify({
//        'err_code' : 0,
//        'err_msg'  : '',
//        'result'   : result,
//    })).toString());
    this.send({
        'err_code' : 0,
        'err_msg'  : '',
        'result'   : result,
    });
};

prototype.sendError = function(errCode, errMsg) {
    logger.error(errMsg);
    this.send({
        'err_code' : errCode,
        'err_msg'  : errMsg,
        'result'   : null,
    });
};

var util = require('util');
prototype.sendErrorOrResult = function(err, result) {
    if (err) {
        this.sendError(
            err.err_code || ErrCode.UnexpectedSystemError,
            util.inspect(err)
        );
    } else {
        this.sendResult(result);
    }
};
