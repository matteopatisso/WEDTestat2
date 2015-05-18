"use strict";
Handlebars.registerHelper('equal', function( lvalue, rvalue, options ) {
    if (arguments.length < 3) {
        throw new Error("Handlebars Helper equal needs 2 parameters");
    } else if( lvalue !== rvalue ) {
        return options.inverse( this );
    } else {
        return options.fn( this );
    }
});

Handlebars.registerHelper("addRankingClass", function( method ) {
	method = method.toLowerCase().charAt(0).toUpperCase() + method.slice(1);

	return this["cantRank" + method] ? 'disabled' : '';
});