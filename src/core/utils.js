'use strict';

import camelCase from 'lodash/string/camelCase';

/**
 * Convert all object attrs to camelCase naming convetsion
 * @param  {Object} obj
 * @return {Object}
 */
export function toCamel(obj) {
  var newObj = {};

  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      obj[key] = toCamel(obj[key]);
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
export function syncObjects(obj, newObj) {
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      obj[key] = syncObjects(obj[key], newObj[camelCase(key)]);
    }
    else {
      obj[key] = newObj[camelCase(key)];

    }
  }

  return obj;
}

/**
* Check if an URL starts and ends with /
* @param  {String} string URL
* @return {String} The fixed URL string
*/
export function checkURL(string) {
  if (typeof string !== 'string') {
    return '/';
  }

  if (string[string.length - 1] !== '/') {
    string += '/';
  }
  if (/http/.test(string)) {
    return string;
  }
  else if (string[0] !== '/' && string[0] !== '.') {
    string = '/' + string;
  }

  return string;
}
