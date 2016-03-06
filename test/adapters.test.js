var assert = require('assert'),
  pkg = require('../package.json'),
  IW = require('../src'),
  RequestJSON = require('../src/adapters/json/requestJson');


describe('adapters', function() {
  describe('#XHR adaptor', function(){
    it('should load JSON adapter by default on nodejs', function() {
      assert.equal(IW.adapters.JSON instanceof RequestJSON, true);
    });
    it('should be able to load an adapter', function() {
      IW.useAdapter('JSON', ['api']);

      assert.equal(IW.adapter instanceof RequestJSON, true);
    });
    it('should be able to parse api addresses correctly', function(done) {
       IW.useAdapter('JSON', ['api']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['/api']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['api/']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['/api/']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['http://jsonplaceholder.typicode.com']);

       assert.equal(IW.adapter.apiUrl, 'http://jsonplaceholder.typicode.com/');
       done();
    });
  });
});
