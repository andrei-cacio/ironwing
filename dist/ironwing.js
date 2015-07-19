/**
 ** ironwing - Ironwing is a lightweight front-end data library for model like data representations
 ** @author Andrei Cacio
 ** @version v0.3.1
 **/
// constructors: IW(type)         -> Asks the API for the sepcific ResultSet (it can return an array or a single object) respecting the REST mapping
//
//               IW(type,id)      -> Asks the API for a specific model with the given ID (returns a single object)
//
//               IW(type,id,attr) -> Creates a model-view with the given attributes and ID that matches the back-end database ID
//
// the addapter attribute serves as the comunication link witht he API
//
// each ViewModel comes with implemeted CRUD methods which can accept a callback function for more flexibile use

function IW(type, id, attr) {
  'use strict';

  this.init(type, id, attr);
}

/**
 * CommonJS support
 */
if (typeof module === 'object') {
  module.exports = IW;
}
/**
 * AMD support
 */
else if (typeof define === 'function' && define.amd) {
  define(function(){
    'use strict';

    return IW;
  });
}


(function() {

    'use strict';

    // Storing all instances to retrieve them using find
    // also used in syncing all models of the same type on update
    var instances = [];

    // The Model main Class and constructor
    IW.prototype.init = function(type, id, attr) {
      var self = this,
          models = [];

      // Check if resource or collection
      this.address = (id) ? type + '/' + id : type;
      this.type = type;

      if (IW.adapter === undefined) {
        throw 'No adapter found';
      }

      this._getAPIWithoutSerializer = function() {
        return IW.adapter.getAPIURL() + this.type + '/' + this.attr.id;
      };

      if (!attr) {
        IW.adapter.onDone(function(model){
          if (model.length) {
            model.forEach(function (item) {
              models.push( new IW(type, item.id, item) );
            });
          }
          else {
            self.attr = model;
          }
        }).onFail(function(){
          throw '\nGET HTTP request failed for the resource: [' + self.type +']. \n';
        }).ajax('get', this.address, false);

      }
      else {
        this.attr = attr;

        if(!this.attr.id) {
          this.attr.id = id;
        }
      }

      if (models.length) {
        return models;
      }

        // If the construcotr is called to fetch a model that is already in the local memory
        // then the local instance is refreshed with the model
        var found = IW.find(this.type, this.attr.id );
        if ( !found ) {
          instances.push(this);
        } else {
          found.attr = this.attr;
        }

        return 1;
      };

    /**
     * Instantiate an adapter so Mjs will use it
     * @param  {String} adapterName The adapter's name (eg. JSON)
     * @param  {Array}  args        An array of arguments
     */
    IW.useAdapter = function(adapterName, args) {
      var adapter;

      if (IW.adapters && IW.adapters.hasOwnProperty(adapterName)) {
        adapter = IW.adapters[adapterName];
        adapter.init.apply(adapter, args);

        IW.adapter = adapter;
      }
    };

    // The update method, sends all attributes via API and if the request was a success it recieves them back
    // also syncs the same models
    IW.prototype.update = function (callback) {
      var self = this,
          modelType    = this.type,
          modelAdapter = this._adapter;

      IW.adapter.onDone(function(newAttr){
        instances.forEach(function(model){
          if (model.type === modelType && model._adapter === modelAdapter) {
            model.attr = newAttr;
          }
        });
      })
      .onFail(function(){
        throw 'A problem has accoured while trying to update the [' + modelType + '] model';
      })
      .ajax('put', this.address, false, self.attr);

      if ( callback ) {
        callback();
      }

    };

    /**
     * Get a model
     * @param  {Function} callback [optional]
     */
     IW.prototype.get = function(callback) {
      var self = this;

      IW.adapter.onDone(function(attr){
        self.attr = attr;
      }).ajax('get', this.address, false);

      if (callback) {
        callback();
      }
    };

    /**
     * Delete a model
     * @param  {Function} callback [optional]
     */
     IW.prototype.delete = function(callback) {
      var self = this;

      IW.adapter('delete', this._getAPIWithoutSerializer(), false);

      if (callback) {
        callback();
      }

      instances = instances.filter(function(model) {
        return model.attr.id !== self.attr.id;
      });

      this.attr = {};
    };

    /**
     * Creates a new model of the type given with the specified attr, if the attr aren't matched the model will not be created
     * @param  {String} type The model type
     * @param  {Object} attr The model's attributes
     */
     IW.create = function(type, attr) {
      var newAttr;

      IW.adapter.onDone(function(attr){
        newAttr = attr;
      }).ajax('post', type, false, { attr: attr });

      if (!newAttr) {
        throw 'A problem has accoured while trying to create a [' + this.type + '] model';
      }

      return new this(type, newAttr.id, newAttr);
    };

    /**
     * Rertrieves a resource from the local cache
     * @param  {String} type The model's type
     * @param  {Number} id   The models'id
     * @return {M}
     */
     IW.find = function(type, id) {

      var found;

      instances.forEach(function(model){

        if (model.type === type && model.attr.id === id) {
          found = model;
        }
      });

      return found;
    };

    /**
     * Finds all resrources from the local cache
     * @param  {String} type The mode's type
     * @return {M}
     */
     IW.findAll = function(type) {

      return instances.filter(function(model){
        return model.type === type;
      });
    };

    // Search by keys

    // IW.search = function(type, what){
    //     var models = new IW(type);

    //     return models.filter(function(model){
    //         return model.attr[ Object.keys(what)[0] ] === what[ Object.keys(what)[0] ]
    //     });
    // }
}());

/**
 * XHR is a wrapper over the XMLHttpRequest object
 * @return {Object}
 */

/* global IW:false */
(function(IW){
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
    IW.adapters = IW.adapters || {};
    IW.adapters.JSON = new XHRJson();

}(IW));