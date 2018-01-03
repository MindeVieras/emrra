
const Media = require('../models/media');
const Auth = require('../helpers/authenticate');

module.exports = function(app) {

  app.get('/api/media/get-all', Auth.isAuthed, Media.getAll);
  app.post('/api/media/put-to-trash', Auth.isAuthed, Media.putToTrash);
  app.post('/api/media/save-image-metadata', Auth.isAuthed, Media.saveImageMetadata);
  app.post('/api/media/save-video-metadata', Auth.isAuthed, Media.saveVideoMetadata);
  app.post('/api/media/save-rekognition-labels', Auth.isAuthed, Media.saveRekognitionLabels);
  app.post('/api/media/generate-image-thumbs', Auth.isAuthed, Media.generateImageThumbs);
  app.post('/api/media/generate-videos', Auth.isAuthed, Media.generateVideos);
};