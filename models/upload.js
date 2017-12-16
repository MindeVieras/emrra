
const uuidv4 = require('uuid/v4');
const connection = require('../config/db');

// Uploads file
exports.upload = function(req, res){
  
  if (req.files) {

    const file = req.files[0];
    const author = req.body.author;
    const entity = req.body.entity;
    const entity_id = req.body.entity_id;
    const status = req.body.status;

    let fileData = {
      s3_key: file.key,
      mime: file.mimetype,
      filesize: file.size,
      org_filename: file.originalname,
      entity: parseInt(entity),
      entity_id: parseInt(entity_id),
      status: parseInt(status),
      author: parseInt(author),
      weight: 0
    };
    // Insert file data to media table
    connection.query('INSERT INTO media set ? ', fileData, function(err, rows){
      if(err) {
        res.json({error: err.sqlMessage});
      } else {
        fileData.media_id = rows.insertId;
        res.json({success: true, data: fileData});
      }
    });
    
  } else {
    res.json({error: 'No file'});
  }
  
  
};

exports.getInitialFiles = function(req, res) {
  // Get all media
  const entity_id = req.params.id;
  connection.query('SELECT * FROM media WHERE entity_id = ?', entity_id, function(err, rows){
    if(err) {
      res.json({ack:'err', msg: err.sqlMessage});
    } else {
      let media = [];
      rows.forEach(function(m){
        media.push({
          uuid: uuidv4(),
          name: m.org_filename,
          size: m.filesize,
          thumbnailUrl: require('../helpers/media').img(m.s3_key)
        });
      });
      res.json(media);
    }
  });
}