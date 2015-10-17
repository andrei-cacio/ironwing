var assert = require('assert'),
  IW = require('../src/index'),
  XHR = require('../src/adapters/XHRJson');

describe('ironwing', function() {
  describe('#XHR adaptor', function(){
    it('should load JSON adapter by default', function() {
      assert.equal(IW.adapters.hasOwnProperty('JSON'), true);
      assert.equal(IW.adapters.JSON instanceof XHR, true);
    });
    it('should be able to load an adapter', function() {
      IW.useAdapter('JSON', ['api']);

      assert.equal(IW.adapter instanceof XHR, true);
    });
    it('should be able to parse api addresses correctly', function() {
       IW.useAdapter('JSON', ['api']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['/api']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['api/']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['/api/']);

       assert.equal(IW.adapter.apiUrl, '/api/');
    });
  });
  describe('#factory method', function() {
    it('factory method returns array or promsie', function() {
      IW.useAdapter('JSON', ['../../demo/api']);

      var promisePosts = IW('posts.json'),
          promisePost = IW('post.json');

      assert.equal(typeof promisePosts.then, 'function');
      assert.equal(typeof promisePost.then, 'function');
    });

    it('should return array for collection', function() {
        IW.useAdapter('JSON', ['../../demo/api']);

        var promisePosts = IW('posts.json');

        return promisePosts.then(function(posts){
          assert.equal(posts.length, 2);
          assert.equal(Array.isArray(posts), true);
        });
    });

    it('should return object for resource', function() {
      IW.useAdapter('JSON', ['../../demo/api']);

      var promisePosts = IW('post.json');

      return promisePosts.then(function(post){
        assert.equal(Array.isArray(post), false);
        assert.equal(post.type, 'post.json');
      });
    });
  });
});
