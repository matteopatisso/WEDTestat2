"use strict";
var data = {
        links: [],
        maxId: null
    },
    auth = require('./../authentication/authentication');

var addLink = function ( link ) {
    if ( data && data.links ) {
        data.links.push(link);
    }
};

var adjustIdCounter = function () {
    var allIds = [];
    if( !data.links.length ) {
        data.maxId = 0;
    } else {
	    data.links.forEach(function(link) {
		    allIds.push(link.id);
	    });

	    data.maxId = Math.max(allIds);
    }
};

var createValidLink = function ( link ) {
    if ( !link.title ) {
        throw "Please provide a link title";
    } else if ( !link.url.match('https?://.+') ) {
        throw "Invalid Link! - URL must start with http(s)://";
    } else if ( auth.isGuest() ) {
        throw "You need to be a user to post a new link";
    }

    if( data.maxId === null ) {
        adjustIdCounter();
    }

	var now = new Date(),
		weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

    var defaultProperties = {
        id: ++data.maxId,
        title: null,
        url: null,
        ranking: 0,
        author: auth.getUsername(),
        date: weekdays[now.getDay()] + ", " + now.getDate() + "." + Number(now.getMonth() + 1) + "." + now.getFullYear()
    };

    for (var prop in defaultProperties) {
        if ( defaultProperties.hasOwnProperty(prop) && !link[prop] ) {
            link[prop] = defaultProperties[prop];
        }
    }

    return link;
};

var deleteLinkById = function ( id ) {
    try {
        data.links.splice( getLinkIndexById(id), 1);
    } catch (err) {
        throw "Could not delete! Error:" + err;
    }
};

var getLinkIndexById = function ( id ) {
    id = Number(id);

    for (var i = 0; i < data.links.length; i++) {
        if ( data.links[i].id === id ) {
            return i;
        }
    }

    throw "Link not found";
};

var getFilteredLinks = function ( filter ) {
    var results = [];

    if ( !filter ) {
        throw "Please define a filter";
    }

    data.links.forEach(function ( link ) {
        for (var prop in filter) {
	        if ( filter.hasOwnProperty(prop) && link.hasOwnProperty(prop) && filter[prop] != link[prop] ) { // must be '!=' and not '!==' in this case!
                return;
            }
        }

        results.push(link);
    });

    return results;
};

var getLinkById = function ( id ) {
    return getFilteredLinks( { id : id } )[0] || null;
};

var sortLinksASC= function ( property ) {
	data.links.sort(function ( a, b ) {
		return a[property] < b[property] ? 1 : -1;
	});
};

var getAll = function () {
	sortLinksASC( 'ranking' );

    return data.links;
};

var voteUp = function ( id ) {
    data.links[ getLinkIndexById(id) ].ranking++;
};

var voteDown = function ( id ) {
    data.links[ getLinkIndexById(id) ].ranking--;
};

var loadLinks = function ( links ) {
    data.links = links;
};

module.exports = {
    deleteLinkById: deleteLinkById,
    getFilteredLinks: getFilteredLinks,
    getLinkById: getLinkById,
    getAll: getAll,
    voteUp: voteUp,
    voteDown: voteDown,
    addLink: addLink,
    createValidLink: createValidLink,
    loadLinks: loadLinks
};