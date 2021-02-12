const _ = require('lodash');

function satinize_plaindate( key, clean, raw ) {
  const parsedDate = parse_plaindate( raw[key] );

  if (!_.isDate(parsedDate)){
    throw new Error(`invalid date '${key}'`);
  }else{
    clean[key] = parsedDate;
  }
}

function transform_date_days_since_epoch(key, clean){
  const date = clean[key];
  const days = date.getTime() / 86400000;

  if(_.isFinite(days)){
      clean[key] = days;
  }else{
    throw new Error(`parameter '${key}' is not a valid date`);
  }
}

/*
  Parse a valid plain date in ISO format, such as '2021-05-25'.
  Dates with a year or month granularity are expanded 
  so that '2021' becomes '2021-01-01' and '2021-05' becomes '2021-05-01'.

  @todo Move date parsing and transform elsewhere ( helpers ?)
*/
function parse_plaindate( date ){
  let re = /^(?<year>-?\d{4,})(?:-(?<month>\d{2})(?:-(?<day>\d{2}))?)?$/;
  let groups = re.exec(date).groups;
  let month = groups.month === undefined ? 1 : groups.month;
  let day = groups.day === undefined ? 1 : groups.day;
  return new Date(Date.UTC(groups.year, month - 1, day));
}

function days_since_epoch( date ){
  return date.getTime() / 86400000;
}

module.exports = {
  satinize_plaindate: satinize_plaindate,
  transform_date_days_since_epoch: transform_date_days_since_epoch 
};
