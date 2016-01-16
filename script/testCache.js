require('../lib/init').init();
var async = require('async');
var AsyncClass = new (require('../lib/AsyncClass').AsyncClass);

var Room = AsyncClass.model('Room');
Room.save({ "_id" : "53b13559c19bd4a08b52df64", "host_id" : 2, "owner_id" : 1, "max_num" : 4, "status" : 0, "created_at" : 1404122457, "updated_at" : 1404122457, "members" : [ 123, 1, 124 ], "gps" : [ -13, 77 ], "__v" : 0 });

var WebSocket = require('faye-websocket'),
    ws        = new WebSocket.Client('ws://localhost:8000/');

ws.on('open', function(event) {
    console.log('open');
    var count = 0;
    var start = _u.time();
    setInterval(function() {
        if (count++ >= 20) console.log(_u.time() - start);
        if (ws) {
            ws.send(JSON.stringify({
                url : '/ws/battle_start',
                params: {
                    user_id: process.env.U,
                    room_id: "53b13559c19bd4a08b52df64",
                    random : _.random(100)
                }
            }));
        }
    }, 20);
});

ws.on('message', function(event) {
    console.log(event.data);
});

ws.on('close', function(event) {
  console.log('close', event.code, event.reason);
  ws = null;
});
/*
{ "_id" : ObjectId("53b13559c19bd4a08b52df64"), "host_id" : 2, "owner_id" : 1, "max_num" : 4, "status" : 0, "created_at" : 1404122457, "updated_at" : 1404122457, "members" : [ 123, 1, 124 ], "gps" : [ -13, 77 ], "__v" : 0 }
*/
