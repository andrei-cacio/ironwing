var assert = require('assert'),
    iwUtils = require('../src/core/utils');

describe('JSON', function() {
    describe('#syncObj', function() {
        it('should be synced', function() {
            var originalJson = {
                user_name: 'Andrei',
                user: 'Andrei',
                email_addr: 'andrei@irongwing'
            };
            var camelCasedJson = {
                userName: 'MihaiAndrei',
                user: 'Andrei',
                emailAddr: 'mihai.andrei@irongwing'
            };
            syncedJSON = iwUtils.syncObj(originalJson, camelCasedJson);

            assert.equal(syncedJSON.user_name, 'MihaiAndrei');
            assert.equal(syncedJSON.email_addr, 'mihai.andrei@irongwing');
        });
    });
});
