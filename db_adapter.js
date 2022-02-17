var mysql = require('mysql');

var con = null;

function Connect() {
    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "talk",
        password: "student511"
    });       
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected to DB!");
    });
}

function Disconnect() {
    con.end(function(err) {
        if (err) {
        return console.log('error:' + err.message);
        }
        console.log('Close the database connection.');
    });
}

function ValueQuery(query) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
  }

module.exports = {
  GetValueQuery: function(query) {
    var res = null;
    return new Promise((resolve, reject) => {
      Connect();
      con.query(query, function (err, result) {            
        if (!err) {
          res = result[0].Id;
          resolve(res);    
        } else {
          res = "error";
          reject(res);
        }      
      });  
      Disconnect();
    });
  },

  SetNewUser: function(login) {
    var res = null;
    return new Promise((resolve, reject) => {
      Connect();
      var query = `call RegisterNewClient(\'${login}\', @_res);`;  
      console.log(query);

      con.query(query, function (err, result) {            
        if (!err) {
          res = result[1][0]._res;
          console.log(res);
          resolve(res);    
        } else {
          res = "error";
          reject(res);
        }      
      });  
      Disconnect();
    });
  },

  LoginUser: function(login, pass) {
    var res = null;
    return new Promise((resolve, reject) => {
      Connect();
      var query = `call LoginUser(\'${login}\', \'${pass}\', @_res);`;  
      console.log(query);

      con.query(query, function (err, result) {            
        if (!err) {
          res = result[0][0]._res;
          console.log(res);
          resolve(res);    
        } else {
          res = "error";
          reject(res);
        }      
      });  
      Disconnect();
    });
  },

  RegNewUser: function(login, pass) {
    var res = null;
    return new Promise((resolve, reject) => {
      Connect();
      var query = `call RegisterNewUser(\'${login}\', \'${pass}\', @_res);`;  
      console.log(query);

      con.query(query, function (err, result) {            
        if (!err) {
          res = result[1][0]._res;
          console.log(res);
          resolve(res);    
        } else {
          res = "error";
          reject(res);
        }      
      });  
      Disconnect();
    });
  },

  GetRooms: function(token) {
    return new Promise((resolve, reject) => {
      Connect();
      var query =  `call GetRooms(\'${token}\');`  
      console.log(query);

      con.query(query, function (err, result) {            
        if (!err) {
          console.log(result[0][0].error);
          var jres = JSON.stringify(result[0]); 
          console.log(jres);
          resolve(jres);           
        } else {
          reject('query_error');
        }      
      });  
      Disconnect();
    });
  },

  GetMessages: function(token,room_id) {
    return new Promise((resolve, reject) => {
      Connect();
      var query = `call GetMessages(\'${token}\', ${room_id});`;
      console.log(query);

      con.query(query, function (err, result) {            
        if (!err) {
          // console.log(result[0][0].error);
          var jres = JSON.stringify(result[0]); 
          console.log('jres: ' + jres);
          resolve(jres);           
        } else {
          reject('query_error');
        }      
      });  
      Disconnect();
    });
  },

  SendMessage: function(token, mtext, room_id) { 
    return new Promise((resolve, reject) => {
      Connect();
      var query = `call SendMessage(\'${token}\', \'${mtext}\', ${room_id});`;
      console.log(query);
      con.query(query, function (err, result) {            
        if (!err) {
          // console.log(result[0][0].error);
          var jres = JSON.stringify(result[0]); 
          console.log('jres: ' + jres);
          resolve(jres);           
        } else {
          reject('query_error');
        }      
      });  
      Disconnect();
    });
  },

  CheckUserByLogin: function(token, login) { 
    return new Promise((resolve, reject) => {
      Connect();
      var query = `call CheckUserByLogin(\'${token}\', \'${login}\');`;
      console.log(query);
      con.query(query, function (err, result) {            
        if (!err) {
          // console.log(result[0][0].error);
          var jres = JSON.stringify(result[0]); 
          console.log('jres: ' + jres);
          resolve(jres);           
        } else {
          reject('query_error');
        }      
      });  
      Disconnect();
    });
  },

  CreateRoom: function(token, room_name, room_users) { 
    return new Promise((resolve, reject) => {
      Connect();
      var query = `call CreateRoom(\'${token}\', \'${room_name}\', \'${room_users}\');`;
      console.log(query);
      con.query(query, function (err, result) {            
        if (!err) {
          // console.log(result[0][0].error);
          var jres = JSON.stringify(result[0]); 
          console.log('jres: ' + jres);
          resolve(jres);           
        } else {
          reject('query_error');
        }      
      });  
      Disconnect();
    });
  },

};