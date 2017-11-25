
const connection = require('../config/db');

// Creates user
exports.upload = function(req, res){

  if (req.file) {

    const file = req.file;
    const author = req.body.author || 1;
    const status = req.body.status || 0;
    const content_type = req.body.content_type || 0;

    let fileData = {
      s3_key : file.key,
      mime: file.mimetype,
      filesize: file.size,
      org_filename : file.originalname,
      content_type : content_type,
      status : status,
      author : author,
      weight: 0
    };
    // Insert file data to media table
    connection.query('INSERT INTO media set ? ', fileData, function(err, rows){
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        fileData.id = rows.insertId;
        res.json({ack: 'ok', msg: 'Media saved', data: fileData});
      }
    });
    
  } else {
    res.json({ack: 'err', msg: 'No file'});
  }
  
  
};
