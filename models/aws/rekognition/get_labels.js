
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');
const rekognition = new AWS.Rekognition();
const config = require('../../../config/config');

module.exports.get = function(key, cb){

    var params = {
        Image: {
            S3Object: {
                Bucket: config.bucket, 
                Name: key
            }
        }, 
        MaxLabels: 100, 
        MinConfidence: 10
    };

    rekognition.detectLabels(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else cb(null, data);
    });

};
