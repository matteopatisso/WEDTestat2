"use strict";

var fs = require('fs'),
    storageFile = __dirname + '/data.json',
    loadSinceLastSave = false;

var save = function ( obj ) {
    var json = JSON.stringify( obj );

    fs.writeFile(storageFile, json, function ( err ) {
        if( err ) {
            throw err;
        }
    });

    loadSinceLastSave = false;
};

var load = function () {
    var result = fs.readFileSync(storageFile, 'utf8');

    loadSinceLastSave = true;
    if( !Boolean(result) ) {
        return [];
    }

    try{
        return JSON.parse(result);
    } catch (e) {
        throw e;
    }
};

var contentHasChanged = function () {
    return !loadSinceLastSave;
};

var dataIsEqual = function ( data ) {
    try {
        return JSON.stringify(data) === JSON.stringify(load());
    } catch (e) {
        return false;
    }
};

module.exports = {
    save : save,
    load : load,
    contentHasChanged : contentHasChanged,
	dataIsEqual : dataIsEqual
};