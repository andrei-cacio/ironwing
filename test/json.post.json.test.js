var assert = require('assert'),
    iwUtils = require('../src/core/utils'),
    clone = require('lodash/lang/clone'),
    postJson = require('../json/post');

describe('JSON', function() {
  describe('#testing on post.json', function() {
    it('should work with large JSON objects', function() {
      var cameledPostCloned =  iwUtils.toCamel(clone(postJson, true)),
          syncedObject;

      cameledPostCloned.processedCover = 'test.jpg';
      cameledPostCloned.blog.userBlog.blog.domainChangeCount = 100;
      cameledPostCloned.blog.userBlog.onepager.processedCover = 'img.jpg';

      syncedObject = iwUtils.syncObjects(postJson, cameledPostCloned);

      assert.equal(syncedObject.processed_cover, 'test.jpg');
      assert.equal(syncedObject.blog.user_blog.blog.domain_change_count, 100);
      assert.equal(syncedObject.blog.user_blog.onepager.processed_cover, 'img.jpg');
    });
    it('should work with arrays inside JSON', function() {
      var cameledPostCloned =  iwUtils.toCamel(clone(postJson, true));

      cameledPostCloned.categories[0].name = 'Linux';

      var syncedObject = iwUtils.syncObjects(postJson, cameledPostCloned);

      assert.equal(syncedObject.categories[0].name, 'Linux');
    });
    it('sync should not affect object structure', function() {
      var cameledPostCloned =  iwUtils.toCamel(clone(postJson, true)),
          syncedObject = iwUtils.syncObjects(postJson, cameledPostCloned);

      assert.equal(JSON.stringify(postJson), JSON.stringify(syncedObject));
    });
  });
});
