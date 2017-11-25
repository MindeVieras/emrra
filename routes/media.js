
const Media = require('../models/media');
const Auth = require('../helpers/authenticate');

module.exports = function(app) {

  app.post('/api/media/save', Auth.isAuthed, Media.save);
  // app.get('/api/users/get-list', Auth.isAdmin, Users.getList);
  // app.get('/api/users/get-one/:id', Auth.isAdmin, Users.getOne);
  // app.delete('/api/users/delete/:id', Auth.isAdmin, Users.delete);

};