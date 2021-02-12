const _ = require('lodash');
const time_common = require ('./_time_common');

function _sanitize( raw, clean ){
  const path_start = 'temporal.window.start';
  const path_end = 'temporal.window.end';
  
  // window can be semi unbounded
  const has_window_start = _.has(raw, path_start);
  const has_window_end = _.has(raw, path_end);
  
  var messages = { errors: [], warnings: [] };
  
  try {
    // window bounds are mappend from the Date domain to Z
    // this is required by the temporal decay function score.
    if( has_window_start ){
      time_common.satinize_plaindate(path_start, clean, raw);
      time_common.transform_date_days_since_epoch(path_start, clean);
    }

    if( has_window_end ){
      time_common.satinize_plaindate(path_end, clean, raw);
      time_common.transform_date_days_since_epoch(path_end, clean);
    }
  }
  catch (err) {
    messages.errors.push( err.message );
  }

  return messages;
}

function _expected(){
  return [
    { name: 'temporal.window.start' },
    { name: 'temporal.window.end' }
  ];
}

module.exports = () => ({
  sanitize: _sanitize,
  expected: _expected
});
