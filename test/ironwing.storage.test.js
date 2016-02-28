var assert = require('assert'),
  IW = require('../src/index'),
  jsonServer = 'http://localhost:3000';

IW.base = jsonServer;

describe('ironwing model', function() {
  describe('#fetching a collection', function() {
    it('should be able to find a model after it was fetched', function() {
      return IW('users').then(function() {
        var modelNr = IW.storage.find('users', 10);
        var modelString = IW.storage.find('users', '10');

        assert.equal(modelNr, modelString);
      });

    });

    it('should be able to find a collection after it was fetched', function() {
      return IW('users').then(function(fetchedUsers) {
        var users = IW.storage.findAll('users');

        assert.equal(users.length, fetchedUsers.length);
        assert.equal(IW.storage.getSize(), 1000);
      });
    });

    it('should be able to find a resource after it was fetched', function() {
      return IW('users', 401).then(function(fetchedPost) {
        var postFound = IW.storage.find('users', 401);

        assert.equal(JSON.stringify(postFound), JSON.stringify(fetchedPost));
        assert.equal(IW.storage.getSize(), 1000);
      });
    });

    it('should not be able to find a resource after it was deleted', function() {
      return IW('users', 402).then(function(fetchedUser) {
        var postFound = IW.storage.find('users', 402);

        assert.equal(JSON.stringify(postFound), JSON.stringify(fetchedUser));
        assert.equal(IW.storage.getSize(), 1000);

        fetchedUser.delete();

        postFound = IW.storage.find('users', 402);

        assert.notEqual(JSON.stringify(postFound), JSON.stringify(fetchedUser));
        assert.equal(!!postFound, false);
        assert.equal(IW.storage.getSize(), 999);
      });
    });
  });
});
