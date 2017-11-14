
var bcrypt = require('bcrypt');
const validator = require('validator');
var connection = require('../config/db');

// Creates user
exports.create = function(req, res){
  // res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  // res.json({ack: 'err', msg: 'no service'});

  let input = req.body;
  
  // // vlaidate form
  if (validator.isEmpty(input.username)) {
    res.json({ack:'err', msg: 'Username is required'});
  }
  if (validator.isLength(input.username, {min:0, max:4})) {
    res.json({ack:'err', msg: 'Username must be at least 5 chars long'});
  }
  if (!validator.isEmail(input.email) && !validator.isEmpty(input.email)){
    res.json({ack:'err', msg: 'Email must be valid'});
  }
  if (validator.isEmpty(input.password) && !userId){
    res.json({ack:'err', msg: 'Password is required'});
  }
  
  let userId = input.id || false;
  bcrypt.hash(input.password, 10, function(err, hash) {
    if (err) {
      res.json({ack:'err', msg: 'Cannot hash password'});
    } else {    
      let data = {
          username : input.username,
          email : input.email,
          password: hash,
          display_name: input.display_name,
          access_level: input.access_level
          // author: req.user.id,
          // status: input.status
      };
      // res.json({ack:'ok', msg: 'Pass hashed', data: hash});
      if (userId) {
      //   //res.send(JSON.stringify(data));
      //   delete data.author;
      //   delete data.password;
      //   connection.query('UPDATE users set ? WHERE id = ?', [data, userId], function(err,rows)     {
                
      //       if(err)
      //         console.log('Error saving user : %s ',err );

      //       res.send(JSON.stringify({ack:'ok'}));
                               
      //     });
      } else {
        connection.query('INSERT INTO users set ? ', data, function(err, rows) {
            if(err) {
              res.json({ack:'err', msg: err.sqlMessage});
            } else {
              res.json({ack:'ok', msg: 'User saved', id: rows.insertId});
            }
          });
      }
    }
  });
};

// Gets users
exports.getAll = function(req, res){
  console.log('gets all');
  connection.query('SELECT * FROM users', function(err, rows) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        res.json({ack:'ok', msg: 'Users list', data: rows});
      }
    });
};
