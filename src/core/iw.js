'use strict';

import Model from './model';
import storage from './storage';

function IW(type, id) {
  if (!IW.adapter) {
    loadAdapter();
  }

  return new Model(type, id, null, IW.adapter);
}

function loadAdapter() {
  const basePath = [IW.base || '/'];

  if (typeof window !== 'undefined') {
    IW.useAdapter('XHRJson', basePath);
  }
  else if (typeof process !== 'undefined') {
    IW.useAdapter('RequestJSON', basePath);
  }
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
