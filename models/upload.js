
// const bcrypt = require('bcrypt');
// const validator = require('validator');
// const connection = require('../config/db');

// Uploads user avatar
exports.avatar = function(req, res){

  console.log(req.file);
  let responseFile = {
    key: req.file.key
  };
  res.json({ack:'ok', msg: req.file});
    
};

