var assert = require('assert'),
    iwUtils = require('../src/core/utils');

describe('JSON', function() {
    describe('#camelCase', function() {
        it('should be camleCased', function() {
            var json = {
                user_name: 'Andrei',
                user: 'Andrei',
                email_addr: 'andrei@irongwing'
            },
            camelCasedJSON = iwUtils.toCamel(json);

            assert.equal(
                camelCasedJSON.hasOwnProperty('userName') &&
                camelCasedJSON.hasOwnProperty('emailAddr'), true);
        });
    });
});
