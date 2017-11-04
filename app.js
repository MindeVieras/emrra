const port = process.env.PORT || 3000;
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

app.get('/', function(req, res){
  res.send('fdsfs');
})

// Start HTTP server
http.createServer(app).listen(port, function(){
  console.log('Server listening on port ' + port);
});
