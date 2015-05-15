"use strict";
var express = require('express'),
    linkMan = require('./../middleware/linkManager/linkManager'),
    auth = require('./../middleware/authentication/authentication'),
    storage = require('./../middleware/storage/storage'),
    links = express.Router();

links.use(function ( req, res, next ) {
    if(storage.contentHasChanged() && !storage.compareData( linkMan.getAll() )) {
        linkMan.loadLinks( storage.load() );
    }
    next();
});


links.get('/:forceData?', function ( req, res ) {
    var newData = linkMan.getAll(),
        dataHasChanged = req.session.lastRequestData !== (JSON.stringify(newData) + auth.getUsername()),
        forceData = Boolean(req.params.forceData);

    if(dataHasChanged || forceData) {
        req.session.lastRequestData = JSON.stringify(newData) + auth.getUsername();
        res.json(newData);
    } else {
        res.type('html');
        res.end();
    }
});

// From this point on the routes requires a Login
links.use(auth.requireLogin);

links.get('/:id', function ( req, res ) {
    res.json(linkMan.getLinkById(req.params.id));
});

links.delete('/:id', function ( req, res, next ) {
    var id = req.params.id,
        link = linkMan.getLinkById(id);

    if ( auth.checkDeletePermission(link) ) {
        linkMan.deleteLinkById(id);
    }

    res.end();
    next();
});

links.post('/', function ( req, res, next ) {
    var link = JSON.parse(req.body.link);
    link = linkMan.createValidLink(link);
    linkMan.addLink(link);
    res.end();
    next();
});


links.post('/:id/up', function ( req, res, next ) {
    linkMan.voteUp(req.params.id);
    res.send(linkMan.getLinkById(req.params.id));
    next();
});

links.post('/:id/down', function ( req, res, next ) {
    linkMan.voteDown(req.params.id);
    res.send(linkMan.getLinkById(req.params.id));
    next();
});

links.use(function () {
    storage.save(linkMan.getAll());
});

module.exports = links;