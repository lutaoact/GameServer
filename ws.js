var WebSocket = require('faye-websocket'),
    http      = require('http');
require('./lib/init').init();
var async = require('async');
var heartBeatCheckTime = 30;
var heartBeatCheckMilliTime = 30 * 1000;
var routes = {};
var FileUtils = require('fileutils');

FileUtils.eachFileMatching(
    /Controller.js$/,
    './app/wscontroller',
    function(err, file, stat) {
        var controllerName = file.replace(/^.*\/(.*).js/, "$1");
        routes = _.extend(routes, require(file).routes);
    },
    function(err, files, stats) {
        startServer(routes);
        recordHost();
    }
);

function socketAliveCheck() {
    var expireTime = _u.time() - heartBeatCheckTime;
    _.each(global.sockets, function(socket, userId) {
        if(socket.pulseTime < expireTime) {
            logger.info("socket " + userId + " not alive now");
        }
    });
}

function recordHost() {
    var HostService =
        new (require('./app/service/HostService.js')['HostService']);
    var hostname = config.hostname;
    var port = config.port;
    HostService.recordHost(
        hostname, port,
        function(err, res) {
            if (err) logger.info(err);
            logger.info("record ws hostname:"+hostname+" port:"+port);
        }
    );
}

function startServer(routes) {
    var server = http.createServer();
    global.sockets = {};

    server.on('upgrade', function(request, socket, body) {

        setInterval(socketAliveCheck, heartBeatCheckMilliTime);

        if (WebSocket.isWebSocket(request)) {
            var ws = new WebSocket(request, socket, body);

            ws.on('message', function(event) {
                var req = JSON.parse(event.data);
                //以user_id为key缓存socket
                var now = _u.time();
                if(global.sockets[req.params.user_id]) {
                    global.sockets[req.params.user_id].pulseTime = now;
                }else{
                    global.sockets[req.params.user_id] = {
                        webSocket   : ws,
                        roomId      : '',
                        pulseTime   : now,
                    };
                }

                routes[req.url](req);
            });

            ws.on('close', function(event) {
                var req = {params : {}, url: '/ws/leave_room'};
                _.each(global.sockets, function(socket, userId) {
                    if (socket.webSocket === ws) {
                        req.params.user_id = userId;
                        req.params.room_id = global.sockets[userId].roomId;
                    }
                });
                if(req.params.room_id) {
                    routes['/ws/do_leave_room'](req);
                }
                delete global.sockets[req.params.user_id];
                ws = null;
            });
        }
    });

    server.listen(config.port);
    logger.info('ws server starting, listening port: ' + config.port);
}
