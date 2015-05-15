"use strict";
var express = require('express'),
    linkMan = require('./../middleware/linkManager/linkManager'),
    auth    = require('./../middleware/authentication/authentication'),
    storage = require('./../middleware/storage/storage'),
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
    }

    res.end();
    next();
});

links.post('/', function ( req, res, next ) {
    var link = JSON.parse( req.body.link );

    link = linkMan.createValidLink(link);
    linkMan.addLink(link);

    res.end();
    next();
});

links.post('/:id/up', function ( req, res, next ) {
	var id = req.params.id;

    linkMan.voteUp( id );
    res.send( linkMan.getLinkById( id ) );

    next();
});

links.post('/:id/down', function ( req, res, next ) {
	var id = req.params.id;

    linkMan.voteDown( id );
    res.send( linkMan.getLinkById( id ) );

    next();
});

links.use(function () {
    storage.save( linkMan.getAll() );
});

module.exports = links;