'use strict';

import {toCamel, syncObjects} from './utils';
import storage from './storage';
import q from 'q';
import clone from 'lodash/lang/clone';

const original = {};
const Defer = q.defer;

export default class Model {
  constructor(type, id, attr, adapter) {
    const models = [],
      p = new Defer();

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
      this.__adapter.onDone((model) => {
        if (model.length) {
          /**
           * GET Collection case
           */
          model.forEach((item) => {
            models.push( new Model(type, item.id, item, this.__adapter) );
          });
          p.resolve(models);
        }
        else {
          /**
           * GET Resource case
           */
          this.attr = toCamel(clone(model, true));
          storage.store(this);
          original[this.type + this.__unique] = model;

          p.resolve(this);
        }
      }).onFail(() => {
        p.reject('GET HTTP request failed for the resource: [' + this.type +']');
      }).ajax('get', this.address, false);

    }
    else {
      /**
       * Create a new Model based on an given ATTR
       * NO REQUEST here
       */
      this.attr = toCamel(clone(attr, true));
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

  /**
   * The update method, sends all attributes via API and if the request was a success it recieves them back
   * also syncs the same models
   * @return {Promise}
   */
  update() {
    const defer = new Defer(),
      originalObj = original[this.type + this.__unique],
      syncedOriginal= syncObjects(originalObj, this.attr);

    this.__adapter.onDone((attr) => {
      this.attr = toCamel(clone(attr, true));
      storage.store(this);
      original[this.type + this.__unique] = attr;

      defer.resolve(this);
    })
    .onFail(() => {
      defer.reject('A problem has accoured while trying to update the [' + this.type + '] model');
    })
    .ajax('put', this.address, false, syncedOriginal);

    return defer.promise;
  }

  get() {
    const defer = new Defer();

    this.__adapter.onDone((attr) => {
      /**
       * GET Resource case
       */
      this.attr = toCamel(clone(attr, true));
      storage.store(this);
      original[this.type + this.__unique] = attr;

      defer.resolve(this);
    }).ajax('get', this.address, false);

    return defer.promise;
  }

  delete() {
    const defer = new Defer();

    this.__adapter.onDone(() => {
      defer.resolve();
    }).onFail(() => {
      defer.reject();
    }).ajax('delete', this.address, false);

    delete original[this.type + this.__unique];

    storage.delete(this);

    this.attr = {};

    return defer.promise;
  }
}

/**
* Creates a new model of the type given with the specified attr, if the attr aren't matched the model will not be created
* @param  {String} type The model type
* @param  {Object} attr The model's attributes
*/
Model.create = function(type, attr, __adapter) {
  const defer = new Defer();

  __adapter.onDone((newAttr) => {
    defer.resolve(new Model(type, newAttr.id, newAttr, __adapter));
  }).onFail(() => {
    defer.reject('A problem has accoured while trying to create a [' + this.type + '] model');
  }).ajax('post', type, false, attr);

  return defer.promise;
};
