"use strict";
var rankingMap  = {},
	fs          = require('fs'),
	storageFile = __dirname + '/rankingData.json';

var registerVote = function ( user, id, method) {
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
	if(!rankingMap.hasOwnProperty( user )) {
		return false;
	}

	return rankingMap[user].hasOwnProperty( id + method );
};

var removeRankingEntry = function ( user, id ) {
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
	if(!fs.existsSync(storageFile)) {
		save();
		rankingMap = {};
	} else {
		rankingMap = JSON.parse(fs.readFileSync( storageFile, 'utf8'));
	}
};

var addRankingInfoToLink = function ( user, link ) {
	var id = link.id;

	if(!rankingMap.hasOwnProperty( user )) {
		link.cantRankUp = link.cantRankDown = false;
	} else {
		link.cantRankUp = rankingMap[ user ].hasOwnProperty( id + 'Up' );
		link.cantRankDown = rankingMap[ user ].hasOwnProperty( id + 'Down' );
	}

	return link;
};

module.exports = {
	registerVote : registerVote,
	hasAlreadyVoted : hasAlreadyVoted,
	removeRankingEntry : removeRankingEntry,
	load : load,
	addRankingInfoToLink : addRankingInfoToLink
};