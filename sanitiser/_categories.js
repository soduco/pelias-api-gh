
var check = require('check-types');

// validate inputs, convert types and apply defaults
function sanitize( unclean, clean ){

  // error & warning messages
  var messages = { errors: [], warnings: [] };

  // default case (no categories specified in GET params)
  clean.categories = [];

  // if categories string has been set
  if( check.unemptyString( unclean.categories ) ){

    // map input categories to valid format
    clean.categories = unclean.categories.split(',')
      .map(function (cat) {
        return cat.toLowerCase().trim(); // lowercase inputs
      })
      .filter( function( cat ) {
        return ( cat.length > 0 );
      });

    if( !clean.categories.length ){
      messages.warnings.push( 'invalid \'categories\': no valid category strings found');
    }
  }

  return messages;

}

// export function
module.exports = sanitize;
