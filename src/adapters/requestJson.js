'use strict';

import request from 'request';
import {checkURL} from '../core/utils';

export default class RequestJSON {
  constructor() {
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
  }

  ajax(method, url, async, data) {
    const options = getRequestOptions(method, this.apiUrl + url, data);

    request(options, (err, res, body) => {
      if (err || !body) {
        this.fail.call();
      }
      else {
        this.done.call(null, JSON.parse(body));
      }
    });
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

function getRequestOptions(method, url, data) {
  const options = {
    method: method.toUpperCase(),
    url: url,
    headers: {
        'User-Agent': 'ironwing',
        'Content-Type': 'application/json;charset=UTF-8'
      }
  };

  if (options.method === 'POST' || options.method === 'PUT') {
    options.body = JSON.stringify(data);
  }

  return options;
}
