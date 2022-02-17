var dba = require('./db_adapter.js');
WebSocket = require('ws'); 
// var EventEmitter = require('events'); 

var clients = [];

const wss = new WebSocket.Server({ port: 9092, clientTracking: true})
console.log('WS: server up.. ')
wss.on('connection', ws => {

  console.log('WS: connect user: ');
  ws.send('WS: ho! ho! ho1');  

  ws.on('message', function(message) {
    console.log(`WS: Received message => ${message}`);
    
    var mess = JSON.parse(message);
    if (mess.type == "new_user") { 
      ws.send('ho!');
      console.log("WS: new_user!");      
      dba.SetNewUser(mess.login).then(connectedClientId => {
        console.log(`WS: connected client: ${connectedClientId}`);  
        ws.id = connectedClientId;
        clients.push(ws);
      }).catch( erro => {
        console.log(erro);
      });
    }  
  })
  ws.on('close', conn => {
    console.log(`WS: disconnected    ${ws.id}`);
  })
})

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post(`/reg_new_user`,(request,response) => {
  console.log('EXPRESS: ' + request.body.login);
  console.log('EXPRESS: ' + request.body.pass);
  var _req = request.body
  // console.log(_req.login);
  dba.RegNewUser(_req.login, _req.pass).then(answer => {
    console.log(`'EXPRESS: answer: ${answer}`);  
    response.end(answer);
  }).catch( erro => {
    console.log('EXPRESS: ' + erro);
  });
});

router.post(`/login_user`,(request,response) => {
  console.log('EXPRESS: ' + request.body.login);
  console.log('EXPRESS: ' + request.body.pass);
  var _req = request.body
  // console.log(_req.login);
  dba.LoginUser(_req.login, _req.pass).then(answer => {
    console.log(`'EXPRESS: answer: ${answer}`);  
    response.end(answer);
  }).catch( erro => {
    console.log('EXPRESS: ' + erro);
  });
});

router.post(`/get_rooms`,(request,response) => {
  console.log('EXPRESS: ' + request.body.token);
  var _req = request.body
  dba.GetRooms(_req.token).then(answer => {
    console.log(`'EXPRESS: answer: ${answer}`);  
    response.end(answer);
    // res.render('user-list', { title: 'rooms', userData: answer});
  }).catch( erro => {
    console.log('EXPRESS: ' + erro);
  });
});

router.post(`/get_messages`,(request,response) => {
  console.log('EXPRESS: ' + request.body.token);
  var _req = request.body
  dba.GetMessages(_req.token, _req.room_id).then(answer => {
    console.log(`'EXPRESS: answer: ${answer}`);  
    response.end(answer);
  }).catch( erro => {
    console.log('EXPRESS: ' + erro);
  });
});

router.post(`/send_message`,(request,response) => {
  console.log('EXPRESS: ' + request.body.token);
  var _req = request.body
  dba.SendMessage(_req.token, _req.mtext,_req.room_id).then(answer => {
    console.log(`'EXPRESS: answer: ${answer}`);  
    response.end(answer);
  }).catch( erro => {
    console.log('EXPRESS: ' + erro);
  });
});

router.post(`/check_user_by_login`,(request,response) => {
  console.log('EXPRESS: ' + request.body.token);
  var _req = request.body
  dba.CheckUserByLogin(_req.token, _req.login).then(answer => {
    console.log(`'EXPRESS: answer: ${answer}`);  
    response.end(answer);
  }).catch( erro => {
    console.log('EXPRESS: ' + erro);
  });
});

router.post(`/create_room`,(request,response) => {
  console.log('EXPRESS: ' + request.body.token);
  var _req = request.body
  dba.CreateRoom(_req.token, _req.room_name, _req.room_users).then(answer => {
    console.log(`'EXPRESS: answer: ${answer}`);      
    response.end(answer);
  }).catch( erro => {
    console.log('EXPRESS: ' + erro);
  });
});

// add router in the Express app.
app.use("/", router);
app.listen(9091, ()=>console.log("EXPRESS: server up.."));

