[![npm version](https://badge.fury.io/js/ironwing.svg)](http://badge.fury.io/js/ironwing)
[![Bower version](https://badge.fury.io/bo/ironwing.svg)](http://badge.fury.io/bo/ironwing)
[![Build Status](https://travis-ci.org/andrei-cacio/ironwing.svg?branch=master)](https://travis-ci.org/andrei-cacio/ironwing)

# About

In a few words, **ironwingjs** is a lightweight, framework-agnostic JavaScript library. **ironginwjs** is ment to be super easy to use and easy to integrate on any app. Out of the box it offers CRUD manipulation over a REST API interface.

### Installation

```sh
$ bower install ironwing
# or
$ npm install ironwing
```

### How it works

Ironwing was ment to be simple. So let's say we have the `/api/users` endpoint and we want to manipulate the data that's coming from that API.

```javascript
// Tell ironwing to interact with the /api base path for all operations
ironwing.useAdapter('JSON', ['/api']);

// Fetch a collection and make a GET hit on /api/users
ironwing('users').then((users) => {
  // do something with users collection
});

// Fetch a single resource
ironwing('users', 100).then((user) => {
  // do something with the fetched user resource
});

// Update a resource
ironwing('users', 100).then((user) => {
  // access the resource attributes via the .attr object
  user.attr.name = 'Carl';
  user.update();
});

// Delete a resource
ironwing('users', 100).then((user) => {
  user.delete();
});
```

#### REST
Here is a map of the endpoints *ironwing* will hit on every operation

| Action            | Method | URL        | Returns    |
| ----------------- | -------|------------|----------- |
| ironwing('users', 1) | GET    | /users/:id | Model      |
| ironwing('users')    | GET    | /users     | Collection |
| user.update()     | PUT    | /users/:id | Model      |
| ironwing.create()        | POST   | /users     | Model      |
| user.delete()     | DELETE | /users/:id | NULL       |

### Core concepts
___

#### Adapters

An adapter is an object which follows a predefined interface so that it can be integrated with ironwing. Out of the box, ironwingjs comes with a ***XHR JSON*** adapter which is an intermediate object that communicates with the `XMLHttpRequest` API. The developer doesn't interact directly with the adapter. The adapter is used *“under the hood”* by **ironwing**. The main purpose of adapters is to easily modify how **ironwing** interacts with the server. Anyone can write their own adapter and use it with ironwingjs. To load an adapter you simply call the `useAdapter` method first.
Here's a simple example:
```javascript
import ironwing from './ironwing';
/**
 * Load an adapter
 * @param  {String} adapterName [The adapter's name (eg. JSON)]
 * @param  {Array}  args        [An array of arguments]
 */
ironwing.useAdapter('JSON', ['/api']);
```
### Storage

By default, **ironwing** has a local *(heap)* storage. After **ironwing** fetches a new model, by default it stores it locally for later use. So for example if we were to fetch data from an endpoint called ***/users/100***:
```javascript
ironwing('users', 100).then((user) => { 
    console.log(user.attr.name); 
});
```
We can later on retrieve that model from memory without any extra trips to the server, by simply calling
```javascript 
var userModel =  ironwing.storage.find('users', 100);
```
Or, if we fetched a collection
```javascript
ironwing('users',).then((users) => { 
  console.log(users.length); 
});
```
we can later on get one or all users type model
```javascript
var usersCollection =  ironwing.storage.findAll('users');
```
For the moment, only the default storage can be used. In future releases we hope to implement a way to switch between storage implementations like an adapter for *local storage* so you can save the state of your models after refresh.

### Proxy objects

The constructor method ironwing() is basically a factory method which returns `Model` instances. Each model exposes CRUD methods for manipulating your data. However, **ironwing** never modifies the raw JSON data directly. It exposes a ***proxy object*** as an intermediate. Each model object has a `.attr` object which contains a camel cased transformation of the JSON response. Everything you edit on the *attr proxy object*, it will be later synced with the original raw response and sent to the back-end. This technique offers control over what gets edited and what doesn't. In future releases, with the help of the proxy object, some cool features can be added like validators on attributes.

A quick create and update example:
```javascript
import ironwing from './ironwing';

var userData = {
    first_name: 'Jon',
    last_name: 'Doe';
};

ironwing.useAdapter('JSON', ['/api']);
ironwing.create('users', userData).then((userModel) => {
    /**
    * a POST request is sent to the server
    * /api/users
    */
    userModel.attr.firstName = 'Jon';
    userModel.attr.lastName = 'Doe';

    userModel.update().then(() => {
        /**
        * a PUT request is sent to the server
        * /api/users/:id
        */
    });
});
```

License
----

MIT
