/**
 * XHR is a wrapper over the XMLHttpRequest object
 * @return {Object}
 */

'use strict';

import {checkURL} from '../../core/utils';

export default class XHRJson {
  constructor() {
    this.xhr = (typeof XMLHttpRequest === 'function') ? new XMLHttpRequest() : null;
    this.appUrl = null;
    this.done = null;
    this.fail = null;
  }

  setUrl(url) {
    this.apiUrl = checkURL(url);
  }

  /**
   * Constructor
   * @param  {String} url The API URL
   */
  init(url) {
    this.apiUrl = checkURL(url);
    this.done = null;
    this.fail = null;

    this.xhr.onreadystatechange = function() {
      var responseObj;

      if (this.xhr.readyState === 4 && this.xhr.status === 200 && typeof this.done === 'function') {
        responseObj = JSON.parse(this.xhr.responseText);

        this.done.call(null, responseObj);
      }
      else if (this.xhr.readyState === 4 && this.xhr.status === 404 && typeof this.fail === 'function') {
        this.fail.call(null);
      }
    }.bind(this);
  }

  /**
   * Perform an AJAX request
   * @param  {String} method HTTP method
   * @param  {String} url    URL string
   * @param  {Boolean} async
   * @param  {Object} data   POST/PUT data
   */
  ajax(method, url, async, data) {
    method = method.toUpperCase();

    if (this.xhr) {
      this.xhr.open(method, this.apiUrl + url, async);

      if (method === 'POST' || method === 'PUT') {
        this.xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        this.xhr.send(JSON.stringify(data));
      }
      else {
        this.xhr.send();
      }
    }
    else {
      var response = require(this.apiUrl + url);

      if (method === 'POST') {
        data.attr.id = 1000;
        this.done.call(null, data.attr);
      }
      else {
        this.done.call(null, response);
      }
    }
  }

  /**
   * URL getter
   * @return {String} URL string
   */
  getAPIURL() {
    return this.apiUrl;
  }

  /**
   * Callback which is if the request is done
   * @param  {Function} callback Callback function
   * @return {Object}            Mjs
   */
  onDone(callback) {
    this.done = callback;

    return this;
  }

  /**
   * Callback which is if the request failed
   * @param  {Function} callback Callback function
   * @return {Object}            Mjs
   */
  onFail(callback) {
    this.fail = callback;

    return this;
  }
}
