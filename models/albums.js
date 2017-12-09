
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
    connection.query('INSERT INTO albums set ? ', data, function(err, row) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {

        // attach media to album if any
        if (input.media.length) {
          input.media.forEach(function(file) {
            var sql = "UPDATE media SET type_id = ?, status = ? WHERE id = ?";
            connection.query(sql, [row.insertId, 1, file.media_id], function(err, rows) {
              if (err) {
                console.log(err)
              } else {
                console.log(rows)
              }
            });
          });
        }

        res.json({ack:'ok', msg: 'Album saved', id: row.insertId});
      }
    });
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
