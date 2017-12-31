
const uuidv4 = require('uuid/v4');
const connection = require('../config/db');

const generateImageThumbs = require('./aws/lambda/generate_thumbs');
const getImageMeta = require('./aws/lambda/get_image_metadata');
const getRekognitionLabels = require('./aws/rekognition/get_labels');

exports.getAlbumMedia = function(id, cb) {
    // get media
  connection.query('SELECT * FROM media WHERE entity_id = ? ', id, function(err, rows){
    if(err) {
      cb(err.sqlMessage);
    } else {
      cb(null, rows);
    }
  });
}

exports.getAll = function(req, res) {
  // Get all media
  connection.query('SELECT * FROM media', function(err, rows){
    if(err) {
      res.json({ack:'err', msg: err.sqlMessage});
    } else {
      let media = [];
      rows.forEach(function(m){
        media.push({
          uuid: uuidv4(),
          name: m.org_filename
        });
      });
      res.json(media);
    }
  });
}

exports.putToTrash = function(req, res) {
  const uuid = req.body.qquuid;
  const status = 2; // Media status TRASHED
  //Put media file to trash
  connection.query('UPDATE media SET status = ? WHERE uuid = ?', [status, uuid], function(err, rows){
    if(err) {
      res.json({ack:'err', msg: err.sqlMessage, error: err.sqlMessage});
    } else {
      res.json({ack: 'ok', msg: 'File removed to trash', success: true});
    }
  });
}

// Get image metadata from lambda and save to DB
exports.saveImageMetadata = function(req, res){
  var key = req.body.key;
  var mediaId = req.body.media_id;
  if (!key && !mediaId) {
    res.json({ack:'err', msg: 'Wrong params'});
  } else {  
    getImageMeta.get(key, function (err, metadata) {
      // save metadata to DB if any
      if (metadata !== null && typeof metadata === 'object') {

        // make meta array
        var values = [];
        Object.keys(metadata).forEach(function (key) {
          let obj = metadata[key];
          values.push([mediaId, key, obj]);
        });
        // make DB query
        var sql = 'INSERT INTO media_meta (media_id, meta_name, meta_value) VALUES ?';
        connection.query(sql, [values], function(err, rows) {
          if (err) {
            res.json({ack:'err', msg: err.sqlMessage});
          }
          res.json({ack:'ok', msg: 'Metadata saved', metadata: metadata});
        });

      } else {
        res.json({ack:'err', msg: 'No metadata saved'});
      }
    });
  }
};

// Get and Save Image Labels from AWS rekognition
exports.saveRekognitionLabels = function(req, res){
  var key = req.body.key;
  var mediaId = req.body.media_id;
  getRekognitionLabels.get(key, function(err, labels){
    // save recognition labels to DB if any
    var labels = labels.Labels;
    if (labels !== null && typeof labels === 'object') {

      // make meta array
      var values = [];
      var labelsObj = new Object();
      Object.keys(labels).forEach(function (key) {
        let obj = labels[key];
        values.push([mediaId, obj.Name, obj.Confidence]);
        labelsObj[obj.Name] = obj.Confidence;
      });
      // make DB query
      var sql = "INSERT INTO rekognition (media_id, label, confidence) VALUES ?";
      connection.query(sql, [values], function(err, rows) {
        if (err) {
          res.json({ack:'err', msg: err.sqlMessage});
        } else {
          res.json({ack:'ok', msg: 'Rekognition Labels saved', rekognition_labels: labelsObj});
        }          
      });
    } else {
      res.json({ack:'err', msg: 'No rekognition labels saved'});
    }
  });
};

// Generate Image Thumbnails
exports.generateImageThumbs = function(req, res){
  var key = req.body.key;
  generateImageThumbs.generate(key, function(err, response){
    res.json({ack:'ok', msg: 'Image thumbnails generated', thumbs: response});
  });
};

// // Generate Videos
// exports.generateVideos = function(req, res){
//     var key = req.body.key;
//     generateVideos.generate(key, function(err, response){
//         return res.send({ack: 'ok', msg: response});
//     });
// };

// // Get video metadata from lambda and save to DB
// exports.saveVideoMeta = function(req, res){
//     // res.setHeader('Content-Type', 'application/json');
//     // firstly get metadata
//     var key = req.body.key;
//     var mediaId = req.body.id;
//     getVideoMeta.get(key, function (err, metadata) {
        
//         if (err) return res.send(JSON.stringify({ack: 'err', msg: err}));
      
//         // save metadata to DB if any
//         if (metadata !== null && typeof metadata === 'object') {
//             // make meta array
//             var values = [];
//             Object.keys(metadata).forEach(function (key) {
//                 let obj = metadata[key];
//                 values.push([mediaId, key, obj]);
//             });

//             // make DB query
//             var sql = "INSERT INTO media_meta (media_id, meta_name, meta_value) VALUES ?";
//             connection.query(sql, [values], function(err, rows) {
//                 if (err) return res.send(JSON.stringify({ack: 'err', msg: 'cant save meta'}));
//                 return res.send(JSON.stringify({ack: 'ok', data: metadata, msg: 'all meta saved'}));
//             });

//         } else {
//             return res.send(JSON.stringify({ack: 'err', msg: 'no meta saved'}));
//         }
//     });
// };

// // Gets presigned image url
// exports.getImageUrl = function(req, res){
//     var key = req.body.key;
//     var style = req.body.style;
//     var url = helpers_custom.img(key, style);
//     return res.send({ack: 'ok', msg: url});
// };

// // Gets presigned video url
// exports.getVideoUrl = function(req, res){
//     var key = req.body.key;
//     var preset = req.body.preset;
//     var url = helpers_custom.video(key, preset);
//     return res.send({ack: 'ok', msg: url});
// };
