/**
 * XHR is a wrapper over the XMLHttpRequest object
 * @return {Object}
 */

'use strict';

import clone from 'lodash/lang/clone';
import {checkURL} from '../../core/utils';

function XHRJson() {
  this.appUrl = null;
  this.done = null;
  this.fail = null;
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

  var response = clone(require(this.apiUrl + url), true);

  if (method === 'POST') {
    data.id = 1000;
    this.done.call(null, data);
  }
  if (method === 'PUT') {
    response.title = data.title;
    this.done.call(null, response);
  }
  else {
    this.done.call(null, response);
  }
};

module.exports = XHRJson;
