

const path = require('path');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');
const s3 = new AWS.S3();
const config = require('../config/config');

// Image url helper
exports.img = function(key) {
  console.log(key);
  // var thumbKey = 'thumbs/'+size+'/'+path.basename(key);

  var params = {
    Bucket: config.bucket, 
    Key: key,
    Expires: 10
  };

  var url = s3.getSignedUrl('getObject', params);
  return url;
    
};

