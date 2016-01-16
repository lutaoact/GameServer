var WebSocket = require('faye-websocket'),
    ws        = new WebSocket.Client('ws://localhost:8000/');
require('../lib/init').init();

ws.on('open', function(event) {
    console.log('open');
    setInterval(function() {
//        ws.send({hello: 'world', url : '/ws/join_room'});
//           * {url:"/ws/battle_set_arrow", params:{start_point, end_point}}
        if (ws) ws.send(JSON.stringify({url : '/ws/join_room', params: {user_id: process.env.U, room_id: "53c74672987b12462056c789", random : _.random(100)}}));
//        ws.send('hello world');
    }, 1000);

//    setTimeout(function() {
//        ws.close();
//    }, 10000);
});

ws.on('message', function(event) {
    console.log(event.data);
//    setInterval(function() {
//        ws.send('Hello, world!');
//    }, 3000);
});

ws.on('close', function(event) {
  console.log('close', event.code, event.reason);
//  ws.close();
  ws = null;
});
