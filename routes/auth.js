"use strict";
var express     = require('express'),
    auth        = require('./../middleware/authentication/authentication'),
    authRouter  = express.Router();

authRouter.get('/login', function ( req, res ) {
   res.send( auth.getUsername() );
});

authRouter.post('/login', function ( req, res ) {
    auth.logInUser( req.body.username );
	req.session.rankingMap = {};
    res.redirect('/linkIt');
});

authRouter.post('/logout', function ( req, res ) {
    auth.logOut();
    res.redirect('/linkIt');
});

module.exports = authRouter;