
const Users = require('../models/users');
const Auth = require('../helpers/authenticate');

module.exports = function(app) {

  app.post('/api/users/create', Auth.isAdmin, Users.create);
  app.get('/api/users/get-all', Auth.isAuthed, Users.getAll);

};