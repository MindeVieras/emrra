
const connection = require('../config/db');

// Uploads file
exports.upload = function(req, res){
  
  if (req.files) {

    const file = req.files[0];
    const uuid = req.body.qquuid;
    const author = req.body.author;
    const entity = req.body.entity;
    const entity_id = req.body.entity_id;
    const status = req.body.status;

    let fileData = {
      uuid: uuid,
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
  const status = 1; // Media status ENABLED
  connection.query(`SELECT
                      m.*,
                      GROUP_CONCAT('"', mm.meta_name, '":"', mm.meta_value SEPARATOR '",') AS metadata
                    FROM media AS m
                      LEFT JOIN media_meta AS mm ON mm.media_id = m.id
                    WHERE m.entity_id = ? AND m.status = ?
                    GROUP BY m.id`, [entity_id, status], function(err, rows){
    if(err) {
      res.json({ack:'err', msg: err.sqlMessage});
    } else {
      let media = [];
      rows.forEach(function(m){
        let metadata = {ack:'err', msg:'No metadata'};
        if (m.metadata) {
          metadata = JSON.parse('{'+m.metadata+'"}');
          metadata.ack = 'ok';
        };
        // metadata 
        media.push({
          uuid: m.uuid,
          name: m.org_filename,
          size: m.filesize,
          thumbnailUrl: require('../helpers/media').img(m.s3_key),
          metadata
        });
      });
      res.json(media);
    }
  });
}