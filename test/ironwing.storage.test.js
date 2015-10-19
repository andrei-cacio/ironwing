var assert = require('assert'),
  IW = require('../src/index');

describe('ironwing model', function() {
  describe('#fetching a collection', function() {
    it('should be able to find a model after it was fetched', function() {
      IW.useAdapter('JSON', ['../../demo/api']);

      return IW('posts.json').then(function() {
        var modelNr = IW.storage.find('posts.json', 386);
        var modelString = IW.storage.find('posts.json', '386');

        assert.equal(modelNr, modelString);
      });

    });

    it('should be able to find a collection after it was fetched', function() {
      IW.useAdapter('JSON', ['../../demo/api']);

      return IW('posts.json').then(function(fetchedPosts) {
        var posts = IW.storage.findAll('posts.json');

        assert.equal(posts.length, fetchedPosts.length);
        assert.equal(IW.storage.getSize(), 2);
      });
    });

    it('should be able to find a resource after it was fetched', function() {
      IW.useAdapter('JSON', ['../../demo/api']);

      return IW('post.json').then(function(fetchedPost) {
        var postFound = IW.storage.find('post.json', 386);

        assert.equal(JSON.stringify(postFound), JSON.stringify(fetchedPost));
        assert.equal(IW.storage.getSize(), 3);
      });
    });

    it('shoudl not be able to find a resource after it was deleted', function() {
       IW.useAdapter('JSON', ['../../demo/api']);

      return IW('post.json').then(function(fetchedPost) {
        var postFound = IW.storage.find('post.json', 386);

        assert.equal(JSON.stringify(postFound), JSON.stringify(fetchedPost));
        assert.equal(IW.storage.getSize(), 3);
      });
    });
  });
});
