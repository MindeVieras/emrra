
const validator = require('validator');
const uuidv4 = require('uuid/v4');

const connection = require('../config/db');

const Media = require('./media');

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
            connection.query(sql, [row.insertId, 1, file.media_id]);
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

// Gets one album
exports.getOne = function(req, res){
  if (typeof req.params.id != 'undefined' && !isNaN(req.params.id) && req.params.id > 0 && req.params.id.length) {
    connection.query(`SELECT * FROM albums WHERE id = ? LIMIT 1`, [req.params.id], function(err, rows) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        if (rows.length) {
          res.json({ack:'ok', msg: 'One album', data: rows[0]});
        } else {
          res.json({ack:'err', msg: 'No such Album'});
        }
      }
    });
  } else {
    res.json({ack:'err', msg: 'bad parameter'});
  }
};

// Deletes album
exports.delete = function(req, res){
  if (typeof req.params.id != 'undefined' && !isNaN(req.params.id) && req.params.id > 0 && req.params.id.length) {
    const id = req.params.id;
    connection.query('DELETE FROM albums WHERE id = ?', [id], function(err, rows) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        if (rows.affectedRows === 1) {
          res.json({ack:'ok', msg: 'Album deleted', data: req.params.id});
        } else {
          res.json({ack:'err', msg: 'No such album'});
        }
      }
    });

  } else {
    res.json({ack:'err', msg: 'bad parameter'});
  }
};

