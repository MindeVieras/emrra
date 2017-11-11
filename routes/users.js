
const Users = require('../models/users');

module.exports = function(app) {

  app.post('/api/users/create', Users.create);
  app.get('/api/users/get-all', Users.getAll);

};