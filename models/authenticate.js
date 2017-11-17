
const bcrypt = require('bcrypt');
const validator = require('validator');
const connection = require('../config/db');
const jwt = require('jsonwebtoken');

const config = require('../config/config');

// Authenticates user
exports.authenticate = function(req, res){

  const input = req.body;
  
  // // vlaidate form
  if (validator.isEmpty(input.username)) {
    res.json({ack:'err', msg: 'Username is required'});
  } else if (validator.isEmpty(input.password)){
    res.json({ack:'err', msg: 'Password is required'});
  } else {
    connection.query("SELECT * FROM users WHERE username = ? LIMIT 1",[input.username], function(err, rows){
        if (err) {
          res.json({ack:'err', msg: err.sqlMessage});
        } else {
          if (rows.length === 0) {
            res.json({ack:'err', msg: 'Incorrect details'});
          } else {
            const passMatch = bcrypt.compareSync(input.password, rows[0].password);
            if (passMatch) {
              const jwtData = {
                id: rows[0].id,
                username: rows[0].username
              };
              let secret_key = rows[0].access_level === 100 ? config.admin_secret_key : config.secret_key;
              const token = jwt.sign(jwtData, secret_key);
              let userData = {
                id: rows[0].id,
                username: rows[0].username,
                display_name: rows[0].display_name,
                email: rows[0].email,
                access_level: rows[0].access_level,
                token
              };
              res.json({ack:'ok', msg: 'Authentication ok', data: userData});
            } else {
              res.json({ack:'err', msg: 'Incorrect details'});
            }
            
          }
        }

    });
  }

};
