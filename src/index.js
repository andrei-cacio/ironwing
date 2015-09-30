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
    IW = require('./core/iw');

var caca = require('./caca');

caca();

/**
 * Inject the adapter to IWjs adapters
 */
IW.adapters = IW.adapters || {};
IW.adapters.JSON = new XHRJson();

module.exports = IW;

window.IW = IW;
