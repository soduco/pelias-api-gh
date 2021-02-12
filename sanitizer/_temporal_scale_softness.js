const _ = require('lodash');

function _sanitize( raw, clean ){

  var messages = { errors: [], warnings: [] };
  
  try {
    //@Todo ensure window bounds +/- scale are valid Numbers
    sanitize_numerofdays( 'temporal.scale', clean, raw);

    sanitize_softness( 'temporal.softness', clean, raw);
  }
  catch (err) {
    messages.errors.push( err.message );
  }

  return messages;
}

function sanitize_numerofdays( key, clean, raw){
  const parsedDays = parseInt( raw[key] );

  if ( _.isFinite( parsedDays ) ) {
    clean[key] = parsedDays;
  }
}

function sanitize_softness( key, clean, raw){
  const parsedFloat = parseFloat( raw[key] );

  if ( _.isFinite( parsedFloat ) ) {
    // Force softness in [0,1]
    const clamped = Math.min(Math.max(parsedFloat, 0.0), 1.0);
    clean[key] = clamped;
  }
}

function _expected(){
  return [
    { name: 'temporal.softness' },
    { name: 'temporal.scale' }
  ];
}

module.exports = () => ({
  sanitize: _sanitize,
  expected: _expected
});
