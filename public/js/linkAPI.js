window.linkAPI = function () {
    "use strict";

    this.fetchAllLinks = function (forceData, success, error, complete) {
        var urlCompletion = forceData ? '/' + forceData : '';
        $.ajax({
            method : 'GET',
            url : '/links' + urlCompletion,
            success : success,
            error : error,
            complete : complete
        });
    };

    this.fetchUsername = function (success, error, complete) {
        $.ajax({
            method : 'GET',
            url : '/login',
            success: success,
            error : error,
            complete : complete
        });
    };

    this.saveNewPost = function (link, success, error, complete) {
        $.ajax('/links', {
            method : 'POST',
            data : { link : JSON.stringify( link ) },
            success: success
        });
    };

    this.deleteLink = function ( id, success, error, complete ) {
        $.ajax({
            method: 'DELETE',
            url : '/links/' + id,
            success : success
        });
    };

    this.voteUp = function ( id, success, error, complete ) {
       vote( id, 'up', success);
    };

    this.voteDown = function ( id, success, error, complete ) {
       vote( id, 'down', success);
    };

    var vote = function ( id, method, success ) {
        $.ajax({
            method : 'POST',
            url : '/links/' + id + '/' + method,
            success : success
        });
    };

    this.fetchTemplate = function (success, error, complete ) {
        $.ajax({
            method : 'GET',
            url : '/handleTemplate',
            success : success
        });
    };

    return this;
};


