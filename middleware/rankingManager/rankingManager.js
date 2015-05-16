"use strict";
var rankingMap  = {},
	fs          = require('fs'),
	storageFile = __dirname + '/rankingData.json',
	initLoading = false;

var registerVote = function ( user, id, method) {
	load();
	var oppositeMethod = method === 'Up' ? 'Down' : 'Up';

	if(!rankingMap.hasOwnProperty( user )) {
		rankingMap[ user ] = { Up : [], Down : []};
	}

	if(rankingMap[ user ].hasOwnProperty(id + oppositeMethod)) {
		delete rankingMap[user][id + oppositeMethod];
	} else {
		rankingMap[user][id + method] = true;
	}

	save();
};

var hasAlreadyVoted = function ( user, id, method ) {
	load();
	if(!rankingMap.hasOwnProperty( user )) {
		return false;
	}

	return rankingMap[user].hasOwnProperty( id + method );
};

var save = function () {
	fs.writeFile(storageFile, JSON.stringify( rankingMap ));
};

var load = function () {
	if(initLoading) {
		return;
	}
	rankingMap = JSON.parse(fs.readFileSync(storageFile, 'utf8'));
	initLoading = true;
};

module.exports = {
	registerVote : registerVote,
	hasAlreadyVoted : hasAlreadyVoted
};