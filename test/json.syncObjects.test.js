var assert = require('assert'),
    iwUtils = require('../src/core/utils');

describe('JSON', function() {
    describe('#syncObjects', function() {
        it('should be synced', function() {
            var originalJson = {
                user_name: 'Andrei',
                user: 'Andrei',
                email_addr: 'andrei@irongwing',
                address: {
                    home_city: 'Brasov',
                    actual_city: 'Cluj-Napoca',
                    actual_country: 'Romania'
                }
            };
            var camelCasedJson = {
                userName: 'MihaiAndrei',
                user: 'Andrei',
                emailAddr: 'mihai.andrei@irongwing',
                address: {
                    homeCity: 'Bucuresti',
                    actualCity: 'Sibiu',
                    actualCountry: 'Romania'
                }
            };
            syncedJSON = iwUtils.syncObjects(originalJson, camelCasedJson);

            assert.equal(syncedJSON.user_name, 'MihaiAndrei');
            assert.equal(syncedJSON.email_addr, 'mihai.andrei@irongwing');
            assert.equal(syncedJSON.address.home_city, 'Bucuresti');
            assert.equal(syncedJSON.address.actual_city, 'Sibiu');
            assert.equal(syncedJSON.address.actual_country, 'Romania');
        });
    });
});
