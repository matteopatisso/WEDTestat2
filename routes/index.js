"use strict";
var express = require('express'),
    linkMan = require('../middleware/linkManager/linkManager'),
    auth    = require('../middleware/authentication/authentication'),
    path    = require('path'),
    router  = express.Router();

router.get('/', function ( req, res ) {
    res.redirect('/linkIt');
});

router.get('/login', function ( req, res ) {
   res.redirect('/auth/login');
});

router.get('/handleTemplate', function ( req, res ) {
    res.sendFile('template.handlebars', { root : path.join(__dirname, '../public/js') });
});

router.get('/linkIt', function ( req, res ) {
    var view     = auth.isGuest() ? 'login' : 'index',
	    errorMsg = req.session.errorMsg || null;

	delete req.session.errorMsg;

    res.render(view, { allLinks : linkMan.getAll(), user : auth.getUsername(), error : errorMsg } );
});

module.exports = router;