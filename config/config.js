
exports.bucket = process.env.S3_BUCKET || 'images.album.mindelis.com';
exports.faces_collection = process.env.FACES_COLLECTION || 'album_faces_local';
exports.transcoder_pipeline = process.env.TRANSCODER_PIPELINE || '1508692593579-7zkwqr';


// check if user authenticated
exports.isAuthed = function (req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}
// check if user admin
exports.isAdmin = function(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated() && req.user.access_level === 100)
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}

