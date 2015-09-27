// constructors: IW(type)         -> Asks the API for the sepcific ResultSet (it can return an array or a single object) respecting the REST mapping
//
//               IW(type,id)      -> Asks the API for a specific model with the given ID (returns a single object)
//
//               IW(type,id,attr) -> Creates a model-view with the given attributes and ID that matches the back-end database ID
//
// the addapter attribute serves as the comunication link witht he API
//
// each ViewModel comes with implemeted CRUD methods which can accept a callback function for more flexibile use

'use strict';

var XHRJson = require('./adapters/XHRJson'),
    camelCase = require('lodash/string/camelCase');

function IW(type, id, attr) {
  return this.init(type, id, attr);
}

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
        self.attr = __toCamel(model);
      }
    }).onFail(function(){
      throw '\nGET HTTP request failed for the resource: [' + self.type +']. \n';
    }).ajax('get', this.address, false);

  }
  else {
    this.attr = __toCamel(attr);

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

function __toCamel(obj) {
  var newObj = {},
      key;

  for (key in obj) {
    newObj[camelCase(key)] = obj[key];
  }

  return newObj;
}

// Search by keys

// IW.search = function(type, what){
//     var models = new IW(type);

//     return models.filter(function(model){
//         return model.attr[ Object.keys(what)[0] ] === what[ Object.keys(what)[0] ]
//     });
// }

/**
 * Inject the adapter to Mjs adapters
 */
IW.adapters = IW.adapters || {};
IW.adapters.JSON = new XHRJson();

module.exports = IW;

if (!!module) {
  window.IW = IW;
}
