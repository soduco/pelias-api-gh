const defaultLabelGenerator = require('pelias-labels');

function setup(labelGenerator) {
  function middleware(req, res, next) {
    return assignLabel(req, res, next, labelGenerator || defaultLabelGenerator);
  }

  return middleware;
}

function assignLabel(req, res, next, labelGenerator) {

  // do nothing if there's nothing to process
  if (!res || !res.data) {
    return next();
  }

  const dedupLabel = {};

  res.data.forEach(function (result) {
    result.label = labelGenerator(result);
    dedupLabel[result.label] = dedupLabel[result.label] || [];
    dedupLabel[result.label].push(result);
  });

  Object.values(dedupLabel)
    .filter(results => results.length > 1)
    .forEach(results => {
      results.forEach(result => {
        result.label = labelGenerator(result, {withOptional: true});
      });
    });

  next();
}

module.exports = setup;
