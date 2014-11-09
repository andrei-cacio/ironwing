/**
 * XHR is a wrapper over the XMLHttpRequest object
 * @return {Object}
 */
/* globals M:true */
(function(M){
    'use strict';

    function XHRJson() {
        var self = this;

        this.xhr = new XMLHttpRequest();
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
    }

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
        this.xhr.open(method, url, async);

        if (method === 'POST' || method === 'PUT') {
            this.xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            this.xhr.send(JSON.stringify(data));
        } 
        else {
            this.xhr.send();
        }
    };

    M.adapter = new XHRJson();
}(M));