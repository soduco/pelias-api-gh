const _ = require('lodash');
const plaindate = require('pelias-contrib-gh').plaindate;

function get_interval_object( es_validtime ) {
  const interval = {};
   
  if( _.isFinite(es_validtime.start) ){
    const date = plaindate.from_days_since_epoch(es_validtime.start);
    interval.start = { in: plaindate.to_string(date) };
  }

  if( _.isFinite(es_validtime.end) ){
    const date = plaindate.from_days_since_epoch(es_validtime.end);
    interval.end = { in: plaindate.to_string(date) };
  }
  
  return interval;
}


module.exports = {
  get_interval_object: get_interval_object 
};