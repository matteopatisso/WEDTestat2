"use strict";
var session;

var fetchSessionData = function ( req, res, next ) {
    session = req.session;
    next();
};

var requireLogin = function ( req, res, next ) {
    if( isLoggedIn() ) {
        next();
    } else {
        throw "You need to auth for that section";
    }
};

var logInUser = function ( username ) {
    session.user = { name : username };
    return true;
};

var logOut = function () {
    delete session.user;
};

var isLoggedIn = function () {
    return Boolean( session && session.user );
};

var isGuest = function () {
    return !isLoggedIn();
};

var getUsername = function () {
    return ( session && session.user ) ? session.user.name : null;
};

var checkDeletePermission = function ( link ) {
    if( !link || !link.hasOwnProperty('author') ) {
        return false;
    }

    return link.author === getUsername();
};

module.exports = {
    requireLogin: requireLogin,
    isLoggedIn: isLoggedIn,
    isGuest: isGuest,
    fetchSessionData: fetchSessionData,
    logInUser: logInUser,
    getUsername: getUsername,
    logOut: logOut,
    checkDeletePermission: checkDeletePermission
};