
const validator = require('validator');
const connection = require('../config/db');

// Creates album
exports.create = function(req, res){

  const input = req.body;
  // // vlaidate input
  if (validator.isEmpty(input.name)) {
    res.json({ack:'err', msg: 'Name is required'});
  } else if (validator.isLength(input.name, {min:0, max:2})) {
    res.json({ack:'err', msg: 'Name must be at least 3 chars long'});
  } else {
    let data = {
      name : input.name,
      start_date : input.start_date,
      end_date: input.end_date,
      author: input.author,
      private: input.private ? 1 : 0,
      status: input.status ? 1 : 0
    };
    // console.log(data);
    connection.query('INSERT INTO albums set ? ', data, function(err, rows) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        res.json({ack:'ok', msg: 'Album saved', id: rows.insertId});
      }
    });

    // check if user exists
    // connection.query('SELECT * FROM users WHERE username = ? LIMIT 1', [input.username], function(err, rows) {
    //   if(err) {
    //     res.json({ack:'err', msg: err.sqlMessage});
    //   } else {
    //     if (rows.length) {
    //       res.json({ack:'err', msg: 'Username already taken'});
    //     } else {
    //       // hashes password
    //       bcrypt.hash(input.password, 10, function(err, hash) {
    //         if (err) {
    //           res.json({ack:'err', msg: 'Cannot hash password'});
    //         } else {    
    //           let data = {
    //               username : input.username,
    //               email : input.email,
    //               password: hash,
    //               display_name: input.display_name,
    //               access_level: input.access_level,
    //               author: input.author,
    //               status: input.status ? 1 : 0
    //           };
    //           // console.log(data);
    //           connection.query('INSERT INTO users set ? ', data, function(err, rows) {
    //               if(err) {
    //                 res.json({ack:'err', msg: err.sqlMessage});
    //               } else {
    //                 // Attach avatar to user if any
    //                 if (input.avatar.id) {
    //                   connection.query('UPDATE media SET type_id = ? WHERE id = ?', [rows.insertId, input.avatar.id]);
    //                 }
    //                 res.json({ack:'ok', msg: 'User saved', id: rows.insertId});
    //               }
    //             });
    //         }
    //       });
    //     }
    //   }
    // });
  }

};

// Gets albums
exports.getList = function(req, res){

  connection.query('SELECT * FROM albums', function(err, rows) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        res.json({ack:'ok', msg: 'Albums list', data: rows});
      }
    });
};
