'use strict';

var utils = require('./utils'),
  Defer = require('q').defer,
  clone = require('lodash/lang/clone'),
  uniqueId = require('lodash/utility/uniqueId'),
  original = {};

// Storing all instances to retrieve them using find
// also used in syncing all models of the same type on update
var instances = [];

// The Model main Class and constructor
function Model(type, id, attr, adapter) {
  var models = [],
    p = new Defer(),
    self = this;

  // Check if resource or collection
  this.address = (id) ? type + '/' + id : type;
  this.type = type;
  this.__adapter = adapter;

  this._getAPIWithoutSerializer = function() {
    return this.__adapter.getAPIURL() + this.type + '/' + this.attr.id;
  };

  if (!attr) {
    this.__adapter.onDone(function(model){
      if (model.length) {
        model.forEach(function (item) {
          models.push( new Model(type, item.id, item, self.__adapter) );
        });
        p.resolve(models);
      }
      else {
        self.__unique = uniqueId();
        original[self.type + self.__unique] = model;
        self.attr = utils.toCamel(clone(model, true));

        p.resolve(self);
      }
    }).onFail(function(){
      throw '\nGET HTTP request failed for the resource: [' + self.type +']. \n';
    }).ajax('get', this.address, false);

  }
  else {
    this.__unique = uniqueId();
    original[this.type + this.__unique] = attr;
    this.attr = utils.toCamel(clone(attr, true));

    if(!this.attr.id) {
      this.attr.id = id;
    }
  }

  if (models.length) {
    return p.promise;
  }

  if (!models.length) {
    // If the construcotr is called to fetch a model that is already in the local memory
    // then the local instance is refreshed with the model
    var found = Model.find(this.type, this.attr.id );
    if ( !found ) {
      instances.push(this);
    } else {
      found.attr = this.attr;
    }
  }

  if (!attr) {
    return p.promise;
  }
}

// The update method, sends all attributes via API and if the request was a success it recieves them back
// also syncs the same models
Model.prototype.update = function (callback) {
  var modelType = this.type,

  modelAdapter = this._adapter,
  originalObj = original[this.type + this.__unique],
  syncedOriginal= {};

  syncedOriginal = utils.syncObjects(originalObj, this.attr);

  this.__adapter.onDone(function(newAttr){
    instances.forEach(function(model){
      if (model.type === modelType && model._adapter === modelAdapter) {

        model.attr = newAttr;
      }
    });
  })
  .onFail(function(){
    throw 'A problem has accoured while trying to update the [' + modelType + '] model';
  })
  .ajax('put', this.address, false, syncedOriginal);

  if ( callback ) {
    callback();
  }

};

/**
* Get a model
* @param  {Function} callback [optional]
*/
Model.prototype.get = function(callback) {
  var self = this;

  this.__adapter.onDone(function(attr){
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
Model.prototype.delete = function(callback) {
  var self = this;

  this.__adapter('delete', this._getAPIWithoutSerializer(), false);

  if (callback) {
    callback();
  }

  delete original[this.type + this.__unique];

  instances = instances.filter(function(model) {
    return model.attr.id !== self.attr.id && model.type === self.type;
  });

  this.attr = {};
};

/**
* Creates a new model of the type given with the specified attr, if the attr aren't matched the model will not be created
* @param  {String} type The model type
* @param  {Object} attr The model's attributes
*/
Model.create = function(type, attr) {
  var newAttr;

  this.__adapter.onDone(function(attr){
    newAttr = attr;
  }).ajax('post', type, false, { attr: attr });

  if (!newAttr) {
    throw 'A problem has accoured while trying to create a [' + this.type + '] model';
  }

  return new Model(type, newAttr.id, newAttr);
};

/**
* Rertrieves a resource from the local cache
* @param  {String} type The model's type
* @param  {Number} id   The models'id
* @return {Model}
*/
Model.find = function(type, id) {
  var found;

  instances.forEach(function(model){
    if (model.type === type && parseInt(model.attr.id) === parseInt(id)) {
      found = model;
    }
  });

  return found;
};

/**
* Finds all resrources from the local cache
* @param  {String} type The mode's type
* @return {Model}
*/
Model.findAll = function(type) {

  return instances.filter(function(model){
    return model.type === type;
  });
};

// Search by keys

// Model.search = function(type, what){
//     var models = new Model(type);

//     return models.filter(function(model){
//         return model.attr[ Object.keys(what)[0] ] === what[ Object.keys(what)[0] ]
//     });
// }

Model.dump = function() {
  instances = [];
  original = {};
};

Model.__getNrOfCahcedModels = function() {
  return instances.length;
};

module.exports = Model;
