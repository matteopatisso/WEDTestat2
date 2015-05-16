"use strict";
var rankingMap  = {},
	fs          = require('fs'),
	storageFile = __dirname + '/rankingData.json',
	initLoading = false;

var registerVote = function ( user, id, method) {
	load();
	var oppositeMethod = method === 'Up' ? 'Down' : 'Up';

	if(!rankingMap.hasOwnProperty( user )) {
		rankingMap[ user ] = {};
	}

	if(rankingMap[ user ].hasOwnProperty(id + oppositeMethod)) {
		delete rankingMap[user][id + oppositeMethod];
	} else {
		rankingMap[user][id + method] = true;
	}

	save( rankingMap );
};

var hasAlreadyVoted = function ( user, id, method ) {
	load();
	if(!rankingMap.hasOwnProperty( user )) {
		return false;
	}

	return rankingMap[user].hasOwnProperty( id + method );
};

var removeRankingEntry = function ( user, id ) {
	load();
	delete rankingMap[ user ][ id + 'Up'];
	delete rankingMap[ user ][ id + 'Down'];
	save();
};

var save = function ( obj ) {
	if(!obj) {
		obj = rankingMap;
	}
	fs.writeFileSync(storageFile, JSON.stringify( obj ));
};

var load = function () {
	if(initLoading) {
		return;
	}
	if(!fs.existsSync(storageFile)) {
		save( {} );
		initLoading = true;
		rankingMap = {};
	} else {
		rankingMap = JSON.parse(fs.readFileSync( storageFile, 'utf8'));
	}
};

module.exports = {
	registerVote : registerVote,
	hasAlreadyVoted : hasAlreadyVoted,
	removeRankingEntry : removeRankingEntry
};