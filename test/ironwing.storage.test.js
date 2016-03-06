var assert = require('assert'),
  IW = require('../src'),
  pkg = require('../package.json');


describe('storage', function() {
  describe('#fetching a collection', function() {
    it('should be able to find a model after it was fetched', function(done) {
      IW.useAdapter('JSON', [pkg.jsonTestServer]);

      return IW('users').then(function() {
        var modelNr = IW.storage.find('users', 10);
        var modelString = IW.storage.find('users', '10');

        assert.equal(modelNr, modelString);
        done();
      });

    });

    it('should be able to find a collection after it was fetched', function(done) {
      return IW('users').then(function(fetchedUsers) {
        var users = IW.storage.findAll('users');

        assert.equal(users.length, fetchedUsers.length);
        assert.equal(IW.storage.getSize(), 1000);
        done();
      });
    });

    it('should be able to find a resource after it was fetched', function(done) {
      return IW('users', 401).then(function(fetchedPost) {
        var postFound = IW.storage.find('users', 401);

        assert.equal(JSON.stringify(postFound), JSON.stringify(fetchedPost));
        assert.equal(IW.storage.getSize(), 1000);
        done();
      });
    });

    it('should not be able to find a resource after it was deleted', function(done) {
      return IW('users', 402).then(function(fetchedUser) {
        var postFound = IW.storage.find('users', 402);

        assert.equal(JSON.stringify(postFound), JSON.stringify(fetchedUser));
        assert.equal(IW.storage.getSize(), 1000);

        return fetchedUser.delete().then(function() {
          postFound = IW.storage.find('users', 402);

          assert.notEqual(JSON.stringify(postFound), JSON.stringify(fetchedUser));
          assert.equal(!!postFound, false);
          assert.equal(IW.storage.getSize(), 999);
          done();
        });
      });
    });
  });
});
