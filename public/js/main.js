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

    var addLinkRequest = function () {
        var title   = $linkTitleField.val(),
            url     = $linkURLField.val(),
            link    = { title : title, url : url },
            regex   = $linkURLField.attr('pattern');

        if ( (!title || !url) || (regex && !url.match( regex ))) {
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
        linkAPI['vote' + method]( id, loadContent );
    };

    var setUsername = function ( name ) {
        username = name;
    };

    var init = function () {
        linkAPI.fetchUsername(function ( username ) {
            setUsername( username );
            linkAPI.fetchTemplate(compileAndLoadTemplate);
        });
    };

    var bindings = function () {
        var $linkForm   = $('.addLink'),
            $addLinkBtn = $('.addLinkBtn');

        $linkForm.on( 'submit', function ( e ) { e.preventDefault(); } );
        $addLinkBtn.on( 'click', addLinkRequest );

	    $linksContainer.on('click', '.vote', function ( e ) {
            var $btn    = $(e.target),
                id      = $btn.parents('.link').data('id'),
                method  = $btn.data('method');

            method = method.toLowerCase().charAt(0).toUpperCase() + method.slice(1);

            vote( id, method );
        });

        $linksContainer.on( 'click', '.delete', function ( e ) {
            var id = $(e.target).parents('.link').data('id');

            linkAPI.deleteLink( id, loadContent );
        });
    };

}(Handlebars, window.linkAPI()));