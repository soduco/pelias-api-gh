
var sanitizeAll = require('../sanitiser/sanitizeAll'),
    sanitizers = {
      text: require('../sanitiser/_text'),
      layers: require('../sanitiser/_layers'),
      size: require('../sanitiser/_size'),
      source: require('../sanitiser/_source'),
      details: require('../sanitiser/_details'),
      geo_search: require('../sanitiser/_geo_search')
    };

var sanitize = function(req, cb) { sanitizeAll(req, sanitizers, cb); };

// export sanitize for testing
module.exports.sanitize = sanitize;

// middleware
module.exports.middleware = function( req, res, next ){
  sanitize( req, function( err, clean ){
    if( err ){
      res.status(400); // 400 Bad Request
      return next(err);
    }
    req.clean = clean;
    next();
  });
};
