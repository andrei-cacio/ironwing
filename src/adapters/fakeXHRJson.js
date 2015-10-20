/**
 * XHR is a wrapper over the XMLHttpRequest object
 * @return {Object}
 */

'use strict';

function XHRJson() {
  this.appUrl = null;
  this.done = null;
  this.fail = null;
}

/**
 * Check if an URL starts and ends with /
 * @param  {String} string URL
 * @return {String} The fixed URL string
 */
 function checkURL(string) {
  if (typeof string !== 'string') {
    return '/';
  }

  if (string[string.length - 1] !== '/') {
    string += '/';
  }
  if (string[0] !== '/' && string[0] !== '.') {
    string = '/' + string;
  }

  return string;
}

/**
 * Constructor
 * @param  {String} url The API URL
 */
 XHRJson.prototype.init = function(url) {
  this.apiUrl = checkURL(url);
  this.done = null;
  this.fail = null;
};

/**
 * URL getter
 * @return {String} URL string
 */
 XHRJson.prototype.getAPIURL = function() {
  return this.apiUrl;
};

/**
 * Callback which is if the request is done
 * @param  {Function} callback Callback function
 * @return {Object}            Mjs
 */
 XHRJson.prototype.onDone = function(callback) {
  this.done = callback;

  return this;
};

/**
 * Callback which is if the request failed
 * @param  {Function} callback Callback function
 * @return {Object}            Mjs
 */
 XHRJson.prototype.onFail = function(callback) {
  this.fail = callback;

  return this;
};

/**
 * Perform an AJAX request
 * @param  {String} method HTTP method
 * @param  {String} url    URL string
 * @param  {Boolean} async
 * @param  {Object} data   POST/PUT data
 */
XHRJson.prototype.ajax = function(method, url, async, data) {
  method = method.toUpperCase();

  var response = require(this.apiUrl + url);

  if (method === 'POST') {
    data.attr.id = 1000;
    this.done.call(null, data.attr)
  }
  else {
    this.done.call(null, response);
  }
};

module.exports = XHRJson;
