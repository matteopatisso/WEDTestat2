"use strict";
var express     = require('express'),
    links       = require('./routes/links'),
    routes      = require('./routes/index'),
    authRouter  = require('./routes/auth'),
    bodyParser  = require('body-parser'),
    auth        = require('./middleware/authentication/authentication'),
    session     = require('express-session'),
    app         = express(),
    server;

app.use(session({
    secret              : 'quainucitrasi!',
    saveUninitialized   : false,
    resave              : false,
    cookie              : { maxAge: 60000 }
}));

app.use(auth.fetchSessionData);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);
app.use('/links', links);
app.use('/auth', authRouter);

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

server = app.listen(3000, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('Ok: %s, port: %s', host, port);
});