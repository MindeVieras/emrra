
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// check if user authenticated
exports.isAuthed = function (req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(req);
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, config.secret_key, function(err, data){
      if (err) {
        res.json({ack:'err', msg: 'Bad token'});
      } else {
        next();
      }
    });
  } else {
    res.json({ack:'err', msg: 'Not authorized'});
  }
}
// // check if user admin
exports.isAdmin = function (req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(req);
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, config.admin_secret_key, function(err, data){
      if (err) {
        res.json({ack:'err', msg: 'Bad token'});
      } else {
        next();
      }
    });
  } else {
    res.json({ack:'err', msg: 'Not authorized'});
  }
}

