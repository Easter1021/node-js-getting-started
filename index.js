// require
var express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

// init app
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.engine('ejs', require('express-ejs-extend'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// init routes
app.use('/', require('./routes/index'));
app.use('/support_lang', require('./routes/support_lang'));
app.use('/v1/translate', require('./routes/api/translate'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
