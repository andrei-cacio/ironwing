'use strict';

var camelCase = require('lodash/string/camelCase');

/**
 * Convert all object attrs to camelCase naming convetsion
 * @param  {Object} obj
 * @return {Object}
 */
function __toCamel(obj) {
  var newObj = {},
      key;

  for (key in obj) {
    if (typeof obj[key] === 'object') {
      obj[key] = __toCamel(obj[key]);
    }
    newObj[camelCase(key)] = obj[key];
  }

  return newObj;
}

module.exports = {
    toCamel: __toCamel
};