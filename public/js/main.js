(function ( Handlebars, linkAPI ) {
    "use strict";

    var $linksContainer, $linkTitleField, $linkURLField,
        template, loopTimer, username, oldData;

    $( document ).ready(function () {
        $linksContainer = $('#allLinks');
        $linkTitleField = $('input.title');
        $linkURLField   = $('input.url');

        bindings();
        init();
    });

    var addLinkRequest = function ( e ) {
        var title   = $linkTitleField.val(),
            url     = $linkURLField.val(),
            link    = { title : title, url : url },
            regex   = 'https?://.+';

	    e.preventDefault();

        if ( (!title || !url) || (regex && !url.match( regex ))) {
	        if(!title) {
		        $linkTitleField.addClass('error');
	        } else {
		        $linkTitleField.removeClass('error');
		        $linkURLField.addClass('error');
	        }
            return;
        }

        linkAPI.saveNewPost(link, clearFieldsForNewLink);
    };

    var clearFieldsForNewLink = function () {
        $linkTitleField.val("");
        $linkURLField.val("");
        loadContent();
    };

    var compileAndLoadTemplate = function ( data ) {
        template = Handlebars.compile( data );
        loadContent();
    };

    var renderContent = function ( data ) {
        if( data ) {
            replaceHTML( data );
            oldData = data;
        }

        if( loopTimer ) {
            clearTimeout( loopTimer );
        }
        loopTimer = setTimeout(loadContent, 2000);
    };

    var forceRenderContent = function () {
	    replaceHTML( oldData );
    };

	var replaceHTML = function ( data ) {
		var html = template( { links : data, user : username } );

		$linksContainer.html(html);
	};

    var loadContent = function () {
        linkAPI.fetchAllLinks( !Boolean(oldData), renderContent );
    };

    var vote = function ( id, method ) {
        linkAPI['vote' + method]( id, loadContent, pageReload);
    };

    var setUsername = function ( name ) {
        username = name;
    };
	
	var pageReload = function (  ) {
		location.reload();
	};

    var init = function () {
        linkAPI.fetchUsername(function ( username ) {
            setUsername( username );
            linkAPI.fetchTemplate(compileAndLoadTemplate);
        });
    };

    var bindings = function () {
	    $('.addLink').on( 'submit', addLinkRequest );

	    $linksContainer.on('click', '.vote', function ( e ) {
            var $btn    = $(e.target),
                id      = $btn.parents('.link').data('id'),
                method  = $btn.data('method');

            method = method.toLowerCase().charAt(0).toUpperCase() + method.slice(1);

            vote( id, method );
        });

        $linksContainer.on( 'click', '.delete', function ( e ) {
            var id = $(e.target).parents('.link').data('id');

            linkAPI.deleteLink( id, loadContent, pageReload );
        });
    };

}(Handlebars, window.linkAPI()));