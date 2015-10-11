var assert = require('assert'),
    iwUtils = require('../src/core/utils'),
    clone = require('lodash/lang/clone'),
    postJson = require('../demo/api/post');

describe('JSON', function() {
  describe('#testong on post.json', function() {
    it('should work with large JSON objects', function() {
      var cameledPostCloned =  iwUtils.toCamel(clone(postJson, true));

      cameledPostCloned.processedCover = 'test.jpg';

      var syncedObject = iwUtils.syncObjects(postJson, cameledPostCloned);

      assert.equal(syncedObject.processed_cover, 'test.jpg');
    });
  });
});
