window.linkAPI = function () {
    "use strict";

	var linkURL = '/links';

    this.fetchAllLinks = function ( forceData, success, error, complete ) {
        var urlCompletion = forceData ? '/' + forceData : '';

        $.ajax({
            method   : 'GET',
            url      : linkURL + urlCompletion,
            success  : success,
            error    : error,
            complete : complete
        });
    };

    this.fetchUsername = function (success, error, complete) {
        $.ajax({
            method   : 'GET',
            url      : '/login',
            success  : success,
            error    : error,
            complete : complete
        });
    };

    this.saveNewPost = function (link, success, error, complete) {
	    $.ajax({
		    method   : 'POST',
		    url      : linkURL,
		    data     : { link : JSON.stringify( link ) },
		    success  : success,
		    error    : error,
		    complete : complete
	    });
    };

    this.deleteLink = function ( id, success, error, complete ) {
	    $.ajax({
		    method   : 'DELETE',
		    url      : linkURL + '/' + id,
		    success  : success,
		    error    : error,
		    complete : complete
	    });
    };

    this.voteUp = function ( id, success, error, complete ) {
       vote( id, 'up', success, error, complete );
    };

    this.voteDown = function ( id, success, error, complete ) {
       vote( id, 'down', success, error, complete );
    };

    var vote = function ( id, method, success, error, complete ) {
        $.ajax({
            method   : 'POST',
	        url      : '/links/' + id + '/' + method,
	        success  : success,
	        error    : error,
	        complete : complete
        });
    };

    this.fetchTemplate = function ( success, error, complete ) {
        $.ajax({
            method   : 'GET',
	        url      : '/handleTemplate',
	        success  : success,
	        error    : error,
	        complete : complete
        });
    };

    return this;
};