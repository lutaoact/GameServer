var Host = new (require('../app/model/Host.js')['Host']);
var async = require('async');
var WebSocket = require('faye-websocket');
var timeoutLimit = 10000;
var _u = require('../lib/util.js');

async.waterfall([
    function(next) {
        Host.find({},next);
    },
    function(hosts, next){
        async.eachSeries(hosts, function(host, callback) {
            testLink(host, callback);
        }, function(err){
            next(err);
        });
    },
], function(err, res) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        process.exit();
    }
});

function inValidHost(host) {
    Host.update(
        {_id : host._id},
        {$set: {is_valid : 0, updated_at : _u.time()}},
        function(err, res){}
    );
}

function validHost(host) {
    Host.update(
        {_id : host._id},
        {$set: {is_valid : 1, updated_at : _u.time()}},
        function(err, res){}
    );
}

function deleteHost(host) {
    Host.remove(
        {_id : host._id},
        function(err, res){}
    );
}

function testLink(host, callback) {
    ws = new WebSocket.Client('ws://'+host.hostname+":"+host.port+"/");
    var start=0;
    var end=0;
    ws.on('open', function(event) {
        console.log(host.hostname+":"+host.port+' open');
        start = _u.milliseconds();
        ws.send('{"params":{"user_id":"222222222222222222222222"}, "url": "/ws/hello"}');
    });
    ws.on('message', function(event){
        end = _u.milliseconds();
        responseTime = end - start;
        console.log(host.hostname+":"+host.port+' get message', event.data, " time: ", responseTime);
        if(responseTime > timeoutLimit){
            if(host.is_valid == 1){
                inValidHost(host);
            }
        }else{
            if(host.is_valid == 0){
                validHost(host);
            }
        }
        ws.close();
    });
    ws.on('error', function(event) {
        console.log(host.hostname+":"+host.port+' have error');
        inValidHost(host);
    });
    ws.on('close', function(event) {
        console.log(host.hostname+":"+host.port+' close', event.code, event.reason);
        ws = null;
        callback();
    });
}

