var assert = require('assert'),
  IW = require('../src/index');

describe('ironwing', function() {
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

        promisePosts.then(function(posts){
          assert.equal(posts.length, 2);
          assert.equal(Array.isArray(posts), true);
        });
    });
  });
});
