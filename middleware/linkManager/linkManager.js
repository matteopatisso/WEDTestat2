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
    if(!data.links.length) {
        data.maxId = 0;
        return;
    }

    data.links.forEach(function(link) {
        allIds.push(link.id);
    });

    data.maxId = Math.max(allIds);
};

var createValidLink = function ( link ) {
    if ( !link.title ) {
        throw "Please provide a link title";
    } else if ( !link.url.match('https?://.+') ) {
        throw "Invalid Link! - URL must start with http(s)://";
    }else if (auth.isGuest()) {
        throw "You need to be a user to post a new link";
    }

    if(data.maxId === null) {
        adjustIdCounter();
    }

    var defaultProperties = {
        id: ++data.maxId,
        title: null,
        url: null,
        ranking: 0,
        author: auth.getUsername(),
        date: new Date().toString()
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
        var index = getLinkIndexById(id);
        data.links.splice(index, 1);
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
            if ( filter.hasOwnProperty(prop) && Number(filter[prop]) !== Number(link[prop]) ) {
                return;
            }
        }

        results.push(link);
    });

    return results;
};

var generateInitData = function () {
    var fields = {
        "title": "T",
        "url": "http://U"
    };

    for (var i = 1; i < 4; i++) {
        var obj = {};
        for (var prop in fields) {
            if ( fields.hasOwnProperty(prop) ) {
                obj[prop] = fields[prop] + i;
            }
        }
        data.links.push(createValidLink(obj));
    }
};

var getLinkById = function ( id ) {
    return getFilteredLinks({'id': id})[0] || null;
};

var getAll = function () {
    data.links.sort(function ( a, b ) {
        return a.ranking < b.ranking ? 1 : -1;
    });

    return data.links;
};

var voteUp = function ( id ) {
    var index = getLinkIndexById(id);
    data.links[index].ranking++;
};

var voteDown = function ( id ) {
    var index = getLinkIndexById(id);
    data.links[index].ranking--;
};

var loadLinks = function ( links ) {
    data.links = links;
};

module.exports = {
    deleteLinkById: deleteLinkById,
    getFilteredLinks: getFilteredLinks,
    generateInitData: generateInitData,
    getLinkById: getLinkById,
    getAll: getAll,
    voteUp: voteUp,
    voteDown: voteDown,
    addLink: addLink,
    createValidLink: createValidLink,
    loadLinks: loadLinks
};