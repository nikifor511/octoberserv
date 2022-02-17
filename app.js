const http = require("http");
const express = require( "express");
const WebSocket = require( "ws");
const dba = require('./db_adapter.js');

const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
const clients = new Map();

const parseJsonAsync = (jsonString) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(JSON.parse(jsonString))
      })
    })
  }

webSocketServer.on('connection', ws => {
    ws.on('message', mess => {
        // webSocketServer.clients.forEach(client => client.send(m));
        parseJsonAsync(mess).then(jsonMess => {
            console.log('mess: ' + jsonMess);

            switch (jsonMess.event) {
                case 'login_user':
                    console.log('login_user: ' + jsonMess.login + ' ' + jsonMess.pass);

                    clients.get(ws).token = 'logeystoken';

                    ws.send('ok');
                    webSocketServer.clients.forEach(client => client.send('user has logged in'));
                    break;

                default:
                  //Здесь находятся инструкции, которые выполняются при отсутствии соответствующего значения
                  //statements_def
                  break;
              }

        });
    });

    ws.on("close", () => {
        clients.delete(ws);
    });

    ws.on("error", e => ws.send(e));
   
    const id = uuidv4();
    // const color = Math.floor(Math.random() * 360);
    const token = null;
    const metadata = { id, token };
    clients.set(ws, metadata);
    ws.send(id);
    console.log('------------------------');
    clients.forEach(client => console.log(client.id + ' ' + client.token));
    console.log('------------------------');

});

server.listen(8999, () => console.log("Server started"))