/**
 * XHR is a wrapper over the XMLHttpRequest object
 * @return {Object}
 */

/* global M:false */
(function(M){
    'use strict';

    function XHRJson() { 
        this.xhr = new XMLHttpRequest();
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
        if (string[0] !== '/') {
            string = '/' + string;
        }

        return string;
    }

    /**
     * Constructor
     * @param  {String} url The API URL
     */
    XHRJson.prototype.init = function(url) {
        var self = this;

        this.apiUrl = checkURL(url);
        this.done = null;
        this.fail = null;

        this.xhr.onreadystatechange = function(){
            var responseObj;

            if (self.xhr.readyState === 4 && self.xhr.status === 200 && typeof self.done === 'function') {
                responseObj = JSON.parse(self.xhr.responseText);

                self.done.call(null, responseObj);
            }
            else if (self.xhr.readyState === 4 && self.xhr.status === 404 && typeof self.fail === 'function') { 
                self.fail.call(null);
            }
        };
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
        this.xhr.open(method, this.apiUrl + url, async);

        if (method === 'POST' || method === 'PUT') {
            this.xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            this.xhr.send(JSON.stringify(data));
        } 
        else {
            this.xhr.send();
        }
    };

    /**
     * Inject the adapter to Mjs adapters
     */
    M.adapters = M.adapters || {};
    M.adapters.JSON = new XHRJson();

}(M));