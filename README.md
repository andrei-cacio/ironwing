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
### Installation

You need Gulp installed globally:

```sh
$ bower install mjs
```

### Adapters

Json AJAX Adapter

### Todo's

 - Offer more adapters
 - Mocking
 - Tests

License
----

MIT