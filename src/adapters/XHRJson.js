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

    XHRJson.prototype.getAPIURL = function() {
        return this.apiUrl;
    };

    XHRJson.prototype.onDone = function(callback) {
        this.done = callback;

        return this;
    };

    XHRJson.prototype.onFail = function(callback) {
        this.fail = callback;

        return this;
    };

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