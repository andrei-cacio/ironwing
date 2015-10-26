'use strict';

import getUniqueID from 'lodash/utility/uniqueId';

var instances = [],
  Storage = {};

Storage.store = function(item) {
  var found = Storage.find(item.type, item.attr.id );

  if (!found) {
    item.__unique = getUniqueID();
    instances.push(item);
  } else {
    item.__unique = found.__unique;
    found.attr = item.attr;
  }
};

Storage.update = function(model, newAttr) {
  instances.forEach((item) => {
    if (item.type === model.type && item.__unique === model.__unique) {
      item.attr = newAttr;
    }
  });
};

/**
* Rertrieves a resource from the local cache
* @param  {String} type The model's type
* @param  {Number} id   The models'id
* @return {Model}
*/
Storage.find = function(type, id) {
  var found;

  instances.forEach((item) => {
    if (item.type === type && parseInt(item.attr.id) === parseInt(id)) {
      found = item;
    }
  });

  return found;
};

/**
* Finds all resrources from the local cache
* @param  {String} type The mode's type
* @return {Object}
*/
Storage.findAll = function(type) {
  return instances.filter((model) => {
    return model.type === type;
  });
};

Storage.delete = function(item) {
  instances = instances.filter((model) => {
    return (model.attr.id !== item.attr.id) ? true : (model.type !== item.type) ? true : false;
  });
};

Storage.getSize = function() {
  return instances.length;
};

// Storage.search = function(type, what){
//     var models = new Model(type);

//     return models.filter(function(model){
//         return model.attr[ Object.keys(what)[0] ] === what[ Object.keys(what)[0] ]
//     });
// }

export default Storage;
