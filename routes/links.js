"use strict";
var express = require('express'),
    linkMan = require('./../middleware/linkManager/linkManager'),
    auth    = require('./../middleware/authentication/authentication'),
    storage = require('./../middleware/storage/storage'),
    rankMan = require('./../middleware/rankingManager/rankingManager'),
    links   = express.Router();

links.use(function ( req, res, next ) {
    if(storage.contentHasChanged() && !storage.dataIsEqual( linkMan.getAll() )) {
        linkMan.loadLinks( storage.load() );
    }
    next();
});

links.get('/:forceData?', function ( req, res ) {
    var newData         = linkMan.getAll(),
        dataHasChanged  = req.session.lastRequestData !== (JSON.stringify(newData) + auth.getUsername()),
        forceData       = Boolean( req.params.forceData );

    if( dataHasChanged || forceData ) {
	    if( auth.isLoggedIn() ) {
		    rankMan.addRankingInfoToLink( auth.getUsername(), newData );
	    }
        req.session.lastRequestData = JSON.stringify( newData ) + auth.getUsername();
        res.json( newData );
    } else {
        res.end();
    }
});

// From this point on, the following routes requires a Login
links.use( auth.requireLogin );

links.get('/:id', function ( req, res ) {
    res.json( linkMan.getLinkById( req.params.id ) );
});

links.delete('/:id', function ( req, res, next ) {
    var id      = req.params.id,
        link    = linkMan.getLinkById(id);

    if ( auth.checkDeletePermission( link ) ) {
        linkMan.deleteLinkById(id);
	    rankMan.removeRankingEntry( auth.getUsername(), id );
    }

    res.end();
    next();
});

links.post('/', function ( req, res, next ) {
    var link = JSON.parse( req.body.link );

    link = linkMan.createValidLink( auth.getUsername(), link);
    linkMan.addLink(link);

    res.end();
    next();
});

links.post('/:id/:method', function ( req, res, next ) {
	var id      = req.params.id,
		user    = auth.getUsername(),
		method  = req.params.method.toLowerCase().charAt(0).toUpperCase() + req.params.method.slice(1);

	if( !rankMan.hasAlreadyVoted( user, id, method )) {
		rankMan.registerVote( user, id, method );
	    linkMan['vote' + method]( id );
	}

	res.end();
    next();
});


links.use(function () {
    storage.save( linkMan.getAll() );
});

module.exports = links;