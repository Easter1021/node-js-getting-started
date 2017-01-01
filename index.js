// env
var fs = require('fs');
if(fs.existsSync('.env'))
    require('dotenv').config();

// require
// var _ = require('lodash');
// var request = require('superagent');
var express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

// init app
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(logger('dev'));
app.use(bodyParser.json({ verify: function (req, res, buf) { req.rawBody = buf; }}));
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
// bot routes
app.use('/bot/line-message', require('./routes/bot/line-message'));

// realtime translate for demo
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    const translate = require('./lib/translate');
    socket.on('request-realtime-translate', function (query) {
        translate.tt(query.text, query).then(function (result) {
            socket.emit('response-realtime-translate', result);
        });
    });
});

server.listen(app.get('port'), function() {
    console.log('Gulp is starting my app on PORT: ', app.get('port'));
});
