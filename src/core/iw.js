'use strict';

var Model = require('./model');

// The Model main Class and constructor
function IW(type, id) {
  if (IW.adapter === undefined) {
    throw 'No adapter found';
  }

  return new Model(type, id, null, IW.adapter);
}

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

IW.find = function(type, id) {
  return Model.find(type, id);
};

IW.findAll = function(type) {
  return Model.findAll(type);
};

module.exports = IW;
