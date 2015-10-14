[![npm version](https://badge.fury.io/js/ironwing.svg)](http://badge.fury.io/js/ironwing)
[![Bower version](https://badge.fury.io/bo/ironwing.svg)](http://badge.fury.io/bo/ironwing)
[![Build Status](https://travis-ci.org/andrei-cacio/ironwing.svg?branch=master)](https://travis-ci.org/andrei-cacio/ironwing)

# About

ironwing is a lightweight library for transforming your api outputs into model like pretty representations on which you can then do CRUD operations. It's similar to ORM like objects. Ironwing is great for your SPA application because you can integrate it with any framework or project. It makes JSON data management easy.

### Version
0.5.1

### How it works
ironwing uses an adapter to comunicate with your restful api. By default it comes with a builtin XHR json adapter.

Here's a simple example:
```js
IW.useAdapter("JSON", ["/api/"]);

var book = new IW("books", 1); // book is a model
var books = new IW("books"); // books is a collection of book models

// You can access the models attributes by the attr key
book.attr.title = 'My new book title';

// You can modify any attribute
book.attr.author = 'John Doe';

// After your are done editing, you can update it!
// at this point a PUT request has been made and the DB is updated via the
// REST API
book.update();
```
### REST
For the above example, suppose we have the book and books model and collection. For these we have the following actions with their urls:

| Action            | Method | URL        | Returns    |
| ----------------- | -------|------------|----------- |
| new IW('books', 1) | GET    | /books/:id | Model      |
| new IW('books')    | GET    | /books     | Collection |
| book.update()     | PUT    | /boosk/:id | Model      |
| IW.Create()        | POST   | /books     | Model      |
| book.delete()     | DELETE | /books/:id | NULL       |


### Methods
Use a loaded adapter
```js
IW.useAdapter(adapterName, [,args]);
```
Search for the <i>book</i> model with the id <i>1</i>

<i>Note:</i> This method only searches in the cache. If you fetched the book collection then all books are cached so you can access any of them whenever you want in your app.
```js
IW.find('books', 1);
```
Same as <i> find </i> but you search for a collection
```js
IW.findAll('books');
```

Creates a new model with the given attributes
```js
IW.Create('books', { title: 'Some title', author: 'Some author' });
```

### Installation

```sh
$ bower install ironwing
# or
$ npm install ironwing
```

## Adapters
Ironwing supports multiple adapters but only one can be used at a time (for now).
When you include an adapter into your application, the adapter becomes available via the:
```js
IW.adapters
```
by default Ironwing comes with the <code> JSON </code> adapter which is described below.
### JSON AJAX Adapter
To intereact with your API via AJAX you ca use the JSON adapter. To use this adapter you simply call this method to let know Ironwing that you wish to use this adapter for all your CRUD operations:
```js
IW.useAdapter('JSON', ['/api']);
```
After this method is called you will have access to the adapter via this object:
```js
IW.adapter
```
This adapter is based on the XMLHTTPRequest object. You can call it a wrapper over XHR. It simply implements 3 methods (for now) for interacting with AJAX requests. This adapter can pe accessed via the:
The methods offered are:
```js
IW.adapter.onDone( callbackFunction(response) );
```
```js
IW.adapter.onFail( callbackFunction() );
```
```js
IW.adapter.ajax(httpMethod, URL, async, data);
```
<i>Note:</i> The data parameter is optional and used only when sending POST or PUT requests

The callback setters (<code>onDone, onFail</code>) returns the adapter object so you can chain them like you do with <code> $.ajax</code> from jQuery.

In the near future I would like to add a better error suport for the <code> onFail </code> setter and add more setters like:
- <code> onComplete </code>
- <code> onAlways </code>
- <code> beforeSend </code>
- etc.

### Todo's

 - Offer more adapters
 - Mocking
 - Tests

License
----

MIT
