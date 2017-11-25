const port = process.env.PORT || 3000;
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json());
app.use(cors());
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, './index.html'));
})

require('./routes/authenticate')(app);
require('./routes/users')(app);
require('./routes/media')(app);
require('./routes/upload')(app);

// Start HTTP server
http.createServer(app).listen(port, function(){
  console.log('Server listening on port ' + port);
});
