// constructors: Model(type)         -> Asks the API for the sepcific ResultSet (it can return an array or a single object) respecting the REST mapping
//
//               Model(type,id)      -> Asks the API for a specific model with the given ID (returns a single object)
//
//               Model(type,id,attr) -> Creates a model-view with the given attributes and ID that matches the back-end database ID
//
// the addapter attribute serves as the comunication link witht he API
//
// each ViewModel comes with implemeted CRUD methods which can accept a callback function for more flexibile use

function M(type, id, attr) {
  'use strict';

  this.init(type, id, attr);
}

/**
 * CommonJS support
 */
if (typeof module === 'object') {
  module.exports = M;
}
/**
 * AMD support
 */
else if (typeof define === 'function' && define.amd) {
  define(function(){
    'use strict';

    return M;
  });
}


(function() {

    'use strict';

    // Storing all instances to retrieve them using find
    // also used in syncing all models of the same type on update
    var instances = [],
        _apiAddress = '/';

    M.setAPIAddress = function(url) {
      if (url[url.length] !== '/'){
        _apiAddress = url + '/';
      }
      else {
        _apiAddress = url;
      }
      console.info(_apiAddress);
    };

    // The Model main Class and constructor
    M.prototype.init = function(type, id, attr) {
      var self = this,
          models = [];

      this._adapter = (id) ? '/api/' + type + '/' + id + '.json' : '/api/' + type + '.json';
      this.type = type;

      this._getAdapterWithoutSerializer = function() {
        return '/api/' + this.type + '/' + this.attr.id;
      };

      if (M.adapter === undefined) {
        throw 'No adapter found';
      }

      if (!attr) {
        M.adapter.onDone(function(model){
          if (model.length) {
            model.forEach(function (item) {
              models.push( new M(type, item.id, item) );
            });
          }
          else {
            self.attr = model;
          }
        }).onFail(function(){
          throw '\nGET HTTP request failed for the resource: [' + self.type +']. \n';
        }).ajax('get', this._adapter, false);

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
        var found = M.find(this.type, this.attr.id );
        if ( !found ) {
          instances.push(this);
        } else {
          found.attr = this.attr;
        }

        return 1;
      };

    // The update method, sends all attributes via API and if the request was a success it recieves them back
    // also syncs the same models

    //
    // TODO: relationship updates
    // BUG: ex: !! IF THE section is updated the section within the page object won't be
    //

    M.prototype.update = function (callback) {
      var self = this,
          modelType    = this.type,
          modelAdapter = this._adapter;

      M.adapter.onDone(function(newAttr){
        instances.forEach(function(model){
          if (model.type === modelType && model._adapter === modelAdapter) {
            model.attr = newAttr;
          }
        });
      })
      .onFail(function(){
        throw 'A problem has accoured while trying to update the [' + modelType + '] model';
      })
      .ajax('put', this._getAdapterWithoutSerializer(), false, { attr: self.attr });

      if ( callback ) {
        callback();
      }

    };

    /**
     * Get a model
     * @param  {Function} callback [optional]
     */
     M.prototype.get = function(callback) {
      var self = this;

      M.adapter.onDone(function(attr){
        self.attr = attr;
      }).ajax('get', self._adapter, false);

      if (callback) {
        callback();
      }
    };

    /**
     * Delete a model
     * @param  {Function} callback [optional]
     */
     M.prototype.delete = function(callback) {
      var self = this;

      M.adapter('delete', this._getAdapterWithoutSerializer(), false);

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
     M.create = function(type, attr) {
      var newAttr;

      M.adapter.onDone(function(attr){
        newAttr = attr;
      }).ajax('post', '/api/' + type + '.json', false, { attr: attr });

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
     M.find = function(type, id) {

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
     M.findAll = function(type) {

      return instances.filter(function(model){
        return model.type === type;
      });
    };

    // Search by keys

    // M.search = function(type, what){
    //     var models = new Model(type);

    //     return models.filter(function(model){
    //         return model.attr[ Object.keys(what)[0] ] === what[ Object.keys(what)[0] ]
    //     });
    // }
}());
;/**
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