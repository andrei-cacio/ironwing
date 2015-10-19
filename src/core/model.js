'use strict';

var utils = require('./utils'),
  storage = require('./storage'),
  Defer = require('q').defer,
  clone = require('lodash/lang/clone'),
  original = {};

// The Model main Class and constructor
function Model(type, id, attr, adapter) {
  var models = [],
    p = new Defer(),
    self = this;

  // Check if resource or collection
  this.address = (id) ? type + '/' + id : type;
  this.type = type;
  this.__adapter = adapter;

  if (!attr) {
    /**
     * GET request case
     * Either fetching a collection
     * Either fetching a resource
     */
    this.__adapter.onDone(function(model){
      if (model.length) {
        /**
         * GET Collection case
         */
        model.forEach(function (item) {
          models.push( new Model(type, item.id, item, self.__adapter) );
        });
        p.resolve(models);
      }
      else {
        /**
         * GET Resource case
         */
        self.attr = utils.toCamel(clone(model, true));
        storage.store(self);
        original[self.type + self.__unique] = model;

        p.resolve(self);
      }
    }).onFail(function(){
      p.reject('GET HTTP request failed for the resource: [' + self.type +']');
    }).ajax('get', this.address, false);

  }
  else {
    /**
     * Create a new Model based on an given ATTR
     * NO REQUEST here
     */
    this.attr = utils.toCamel(clone(attr, true));
    storage.store(this);
    original[this.type + this.__unique] = attr;

    if(!this.attr.id) {
      this.attr.id = id;
    }
  }

  /**
   * return collection
   */
  if (models.length) {
    return p.promise;
  }

  /**
   * return resource
   */
  if (!attr) {
    return p.promise;
  }
}

// The update method, sends all attributes via API and if the request was a success it recieves them back
// also syncs the same models
Model.prototype.update = function () {
  var self = this,
    defer = new Defer(),
    originalObj = original[this.type + this.__unique],
    syncedOriginal= {};

  syncedOriginal = utils.syncObjects(originalObj, this.attr);

  this.__adapter.onDone(function(){
    defer.resolve();
  })
  .onFail(function(){
    defer.reject('A problem has accoured while trying to update the [' + self.type + '] model');
  })
  .ajax('put', this.address, false, syncedOriginal);

  return defer.promise;
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
*/
Model.prototype.delete = function() {
  var defer = new Defer();
  this.__adapter.onDone(function(){
    defer.resolve();
  }).onFail(function(){
    defer.reject();
  }).ajax('delete', this.address, false);

  delete original[this.type + this.__unique];

  storage.delete(this);

  this.attr = {};

  return defer.promise;
};

/**
* Creates a new model of the type given with the specified attr, if the attr aren't matched the model will not be created
* @param  {String} type The model type
* @param  {Object} attr The model's attributes
*/
Model.create = function(type, attr) {
  var defer = new Defer(),
    newAttr;

  this.__adapter.onDone(function(){
    defer.resolve(new Model(type, newAttr.id, newAttr));
  }).onFail(function() {
    defer.reject('A problem has accoured while trying to create a [' + this.type + '] model');
  }).ajax('post', type, false, { attr: attr });

  return defer.promise;
};

module.exports = Model;
