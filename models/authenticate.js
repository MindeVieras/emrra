
var bcrypt = require('bcrypt');
const validator = require('validator');
var connection = require('../config/db');

// Authenticates user
exports.authenticate = function(req, res){
  console.log(req.body);
  // res.json({ack: 'err', msg: 'no service'});

  let input = req.body;
  
  // // vlaidate form
  if (validator.isEmpty(input.username)) {
    res.json({ack:'err', msg: 'Username is required'});
  }
  if (validator.isEmpty(input.password)){
    res.json({ack:'err', msg: 'Password is required'});
  }

  connection.query("SELECT * FROM users WHERE username = ?",[input.username], function(err, rows){
      if (err) {
        res.json({ack:'err', msg: err.sqlMessage});
      }

      if (rows.length === 0) {
        res.json({ack:'err', msg: 'No user found'});
      } else {
        let passMatch = bcrypt.compareSync(input.password, rows[0].password);
        if (passMatch) {
          let userData = {
            id: rows[0].id,
            username: rows[0].username,
            display_name: rows[0].display_name,
            email: rows[0].email,
            access_level: rows[0].access_level,
            token: 'fake-jwt-token'
          };
          res.json({ack:'ok', msg: 'Login ok', data: userData});
        } else {
          res.json({ack:'err', msg: 'Incorect password'});
        }
        
      }

  });
};
