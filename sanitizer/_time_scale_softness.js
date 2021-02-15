const _ = require('lodash');
const vn = require('pelias-contrib-gh').query.variables_names.clean;

function _sanitize( raw, clean ){
  var messages = { errors: [], warnings: [] };
  
  try {
    //@Todo ensure window bounds +/- scale are valid Numbers
    sanitize_scale(vn.time_scale, clean, raw);
    sanitize_softness(vn.time_softness, clean, raw);
  }
  catch (err) {
    messages.errors.push( err.message );
  }

  return messages;
}

function sanitize_scale( key, clean, raw ){
  const parsedDays = parseInt( raw[key] );

  if ( _.isFinite( parsedDays ) ) {
    clean[key] = parsedDays;
  }
}

function sanitize_softness( key, clean, raw ){
  const parsedFloat = parseFloat( raw[key] );

  if ( _.isFinite( parsedFloat ) ) {
    // Force softness in [0,1]
    clean[key] = clamp(parsedFloat);
  }
}

// @todo should go in a separate package
function clamp(value, min=0, max=1){
  return Math.min(Math.max(value, min), max);
}

function _expected(){
  return [
    { name: vn.time_scale },
    { name: vn.time_softness }
  ];
}

module.exports = () => ({
  sanitize: _sanitize,
  expected: _expected
});
