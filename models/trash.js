
const connection = require('../config/db');

// const Media = require('./media');

// Gets trash items
exports.getList = function(req, res){

  const status = 2; //Trashed file

  connection.query('SELECT * FROM media WHERE status = ? ORDER BY id DESC', status, function(err, rows) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        res.json({ack:'ok', msg: 'Trash list', data: rows});
      }
    });
};

// Restores trash item
exports.restore = function(req, res){
  if (typeof req.params.id != 'undefined' && !isNaN(req.params.id) && req.params.id > 0 && req.params.id.length) {
    const id = req.params.id;
    const status = 1; //Enabled file
    connection.query('UPDATE media SET status = ? WHERE id = ?', [status, id], function(err, rows) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        if (rows.affectedRows === 1) {
          res.json({ack:'ok', msg: 'Media file restored', data: req.params.id});
        } else {
          res.json({ack:'err', msg: 'No such media file'});
        }
      }
    });

  } else {
    res.json({ack:'err', msg: 'bad parameter'});
  }
};

// Deletes trash item (permenent)
exports.delete = function(req, res){
  if (typeof req.params.id != 'undefined' && !isNaN(req.params.id) && req.params.id > 0 && req.params.id.length) {
    const id = req.params.id;
    connection.query('DELETE FROM media WHERE id = ?', [id], function(err, rows) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        if (rows.affectedRows === 1) {
          res.json({ack:'ok', msg: 'Media file deleted', data: req.params.id});
        } else {
          res.json({ack:'err', msg: 'No such media file'});
        }
      }
    });

  } else {
    res.json({ack:'err', msg: 'bad parameter'});
  }
};
