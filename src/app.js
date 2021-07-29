const express = require('express');
const bodyParse = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/api');
const indexRouter = require('./routes/index');
const PORT = 3000;

app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', indexRouter);
app.use('/api', apiRouter);


function onStart(){
    console.log(`Server running on port ${PORT}`);
}

app.listen(PORT, onStart);

module.exports = app;











/*


const fs = require('fs');
const express = require('express');
const app = express();
const bodyParse = require('body-parser');
 
var port = process.env.PORT || 3000;
 
var db = require('./db');
 
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
 
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));
app.use(require('./controllers'));

 
db.connect(config.db);
 
app.listen(port, function() {
    console.log('listen to port:' + port);
})
*/