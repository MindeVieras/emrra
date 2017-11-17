
const bcrypt = require('bcrypt');
const validator = require('validator');
const connection = require('../config/db');

// Creates user
exports.create = function(req, res){

  // console.log(req.headers);

  const input = req.body;
  // // vlaidate input
  if (validator.isEmpty(input.username)) {
    res.json({ack:'err', msg: 'Username is required'});
  } else if (validator.isLength(input.username, {min:0, max:4})) {
    res.json({ack:'err', msg: 'Username must be at least 5 chars long'});
  } else if (!validator.isEmail(input.email) && !validator.isEmpty(input.email)){
    res.json({ack:'err', msg: 'Email must be valid'});
  } else if (validator.isEmpty(input.password)){
    res.json({ack:'err', msg: 'Password is required'});
  } else if (validator.isLength(input.password, {min:0, max:4})) {
    res.json({ack:'err', msg: 'Password must be at least 5 chars long'});
  } else {
    // check if user exists
    connection.query('SELECT * FROM users WHERE username = ? LIMIT 1', [input.username], function(err, rows) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        if (rows.length) {
          res.json({ack:'err', msg: 'Username already taken'});
        } else {
          // hashes password
          bcrypt.hash(input.password, 10, function(err, hash) {
            if (err) {
              res.json({ack:'err', msg: 'Cannot hash password'});
            } else {    
              let data = {
                  username : input.username,
                  email : input.email,
                  password: hash,
                  display_name: input.display_name,
                  access_level: input.access_level || 25,
                  author: input.author || 0,
                  status: input.status || 0
              };

              connection.query('INSERT INTO users set ? ', data, function(err, rows) {
                  if(err) {
                    res.json({ack:'err', msg: err.sqlMessage});
                  } else {
                    res.json({ack:'ok', msg: 'User saved', id: rows.insertId});
                  }
                });
            }
          });
        }
      }
    });
  }
  
  
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
