const _ = require('lodash');
const plaindate = require('pelias-contrib-gh').plaindate;
const vn = require('pelias-contrib-gh').query.variables_names.clean;


function sanitize_date( key, clean, raw ) {
  const parsedDate = new Date( raw[key] );

  if (!_.isDate(parsedDate) || _.isNaN(parsedDate.getTime())){
    throw new Error(`invalid date '${key}'`);
  }else{
    clean[key] = plaindate.to_days_since_epoch(parsedDate);
  }
}

function _sanitize( raw, clean ){
  var messages = { errors: [], warnings: [] };
  
  try {

    [vn.time_window_start, vn.time_window_end].map((bound_name) => {
      if( !_.isEmpty(raw[bound_name]) ){
        sanitize_date(bound_name, clean, raw);
      }
    });

    // Having end < start leads to inconsistent behavior of time filters and decays.
    if( clean[vn.time_window_start] > clean[vn.time_window_end] ) {
      throw new Error(`${vn.time_window_end} must be greater than or equals to ${vn.time_window_start}`);
    }
  }
  catch (err) {
    messages.errors.push( err.message );
  }

  return messages;
}

function _expected(){
  return [
    { name: vn.time_window_start },
    { name: vn.time_window_end }
  ];
}

module.exports = () => ({
  sanitize: _sanitize,
  expected: _expected
});
