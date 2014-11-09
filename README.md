# Mjs

Mjs (from Model from MVC) is a lightweight data layer for consuming a REST API. This library can be included in a micro framework or you can just simply throw it in your project and it will work. By lightweight it means it supports minimal CRUD interaction.

### Version
0.1

### How it works
Mjs depends on an adapter. Out of the box it comes with a JSON Ajax adapter. In the future I hope I will offer more adapters out of the box.

Here's a simple example:
```js
var book = new M("books", 1); // book is a model
var books = new M("books"); // books is a collection of book models
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

Action | Method  | URL | Returns
------------- | -------------
new M('book', 1) | GET  | /book/:id | Model
new M('book') | GET | /book | Collection
book.update() | PUT | /book/:id | Model
M.Create() | POST | /book | Model
book.delete() | DELETE | /book/:id | NULL

### Methods
Search for the <i>book</i> model with the id <i>1</i>

<i>Note:</i> This method only searches in the cache. If you fetched the book collection then all books are cached so you can access any of them whenever you want in your app.
```js
M.find('books', 1);
```
Same as <i> find </i> but you search for a collection
```js
M.findAll('books');
```

Creates a new Model with the given attributes
```js
M.Create('books', { title: 'Some title', author: 'Some author });
```

### Installation

You need bower installed globally:

```sh
$ bower install mjs
```

## Adapters
### Json AJAX Adapter
This adapter is based on the XMLHTTPRequest object.


### Todo's

 - Offer more adapters
 - Mocking
 - Tests

License
----

MIT
