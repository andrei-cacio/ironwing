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

/**
 * [__syncObjects description] draft
 * @param  {[type]} obj       [description]
 * @param  {[type]} camledObj [description]
 * @return {[type]}           [description]
 */
function __syncObjects(obj, newObj) {
  var key;

  for (key in obj) {
    if (typeof obj[key] === 'object') {
      obj[key] = __syncObjects(obj[key], newObj[camelCase(key)]);
    }
    else {
      return newObj[camelCase(key)];
    }
  }
}


module.exports = {
    toCamel: __toCamel,
    syncObjects: __syncObjects
};