'use strict';

import Model from './model';
import storage from './storage';

function IW(type, id) {
  if (!IW.adapter) {
    IW.useAdapter('JSON', [IW.base || '/']);
  }

  return new Model(type, id, null, IW.adapter);
}

/**
 * Instantiate an adapter so ironwing will use it
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

IW.create = function(type, attr) {
  return Model.create(type, attr, IW.adapter);
};

IW.storage = storage;

export default IW;
