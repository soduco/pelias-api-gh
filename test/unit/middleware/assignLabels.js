var proxyquire =  require('proxyquire').noCallThru();

module.exports.tests = {};

module.exports.tests.serialization = function(test, common) {
  test('undefined res should not throw an exception', function(t) {
    var assignLabels = require('../../../middleware/assignLabels')(function(){});

    function testIt() {
      assignLabels(undefined, {}, function() {});
    }

    t.doesNotThrow(testIt, 'an exception should not have been thrown');
    t.end();

  });

  test('res without data should not throw an exception', function(t) {
    var assignLabels = require('../../../middleware/assignLabels')(function(){});

    function testIt() {
      assignLabels({}, {}, function() {});
    }

    t.doesNotThrow(testIt, 'an exception should not have been thrown');
    t.end();

  });

  test('labels should be assigned to all results', function(t) {
    var labelGenerator = function(result) {
      if (result.id === 1) {
        return 'label 1';
      }
      if (result.id === 2) {
        return 'label 2';
      }

    };

    var assignLabels = require('../../../middleware/assignLabels')(labelGenerator);

    var input = {
      data: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    };

    var expected = {
      data: [
        {
          id: 1,
          label: 'label 1'
        },
        {
          id: 2,
          label: 'label 2'
        }
      ]
    };

    assignLabels({}, input, function () {
      t.deepEqual(input, expected);
      t.end();
    });

  });

  test('no explicit labelGenerator supplied should use pelias-labels module', function(t) {
    var assignLabels = proxyquire('../../../middleware/assignLabels', {
      'pelias-labels': function(result) {
        if (result.id === 1) {
          return 'label 1';
        }
      }
    })();

    var input = {
      data: [
        {
          id: 1
        }
      ]
    };

    var expected = {
      data: [
        {
          id: 1,
          label: 'label 1'
        }
      ]
    };

    assignLabels({}, input, function () {
      t.deepEqual(input, expected);
      t.end();
    });

  });

  test('support name aliases', function(t) {
    var assignLabels = require('../../../middleware/assignLabels')();

    var res = {
      data: [{
        name: {
          default: ['name1','name2']
        }
      }]
    };

    var expected = {
      data: [{
        name: {
          default: ['name1','name2']
        },
        label: 'name1'
      }]
    };

    assignLabels({}, res, function () {
      t.deepEqual(res, expected);
      t.end();
    });

  });

  test('support with optionnal', function(t) {
    let withoutOptionCalls = 0;
    let withOptionCalls = 0;
    var assignLabels = proxyquire('../../../middleware/assignLabels', {
      'pelias-labels': function(result, options) {
        if(!options) {
          withoutOptionCalls++;
          return 'lab.el';
        } else if (options.withOptional && result.id === 1) {
          withOptionCalls++;
          return 'lab.el, region 1';
        } else if (options.withOptional && result.id === 2) {
          withOptionCalls++;
          return 'lab.el, region 2';
        }
      }
    })();
    var res = {
      data: [{
        id: 1,
        name: {
          default: ['lab.el']
        }
      },{
        id: 2,
        name: {
          default: ['lab.el']
        }
      }]
    };

    var expected = {
      data: [{
        id: 1,
        name: {
          default: ['lab.el']
        },
        label: 'lab.el, region 1'
      },{
        id: 2,
        name: {
          default: ['lab.el']
        },
        label: 'lab.el, region 2'
      }]
    };

    assignLabels({}, res, function () {
      t.deepEqual(res, expected);
      t.deepEqual(withOptionCalls, 2);
      t.deepEqual(withoutOptionCalls, 2);
      t.end();
    });
  });

};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('[middleware] assignLabels: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
