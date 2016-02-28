var assert = require('assert'),
  pkg = require('../package.json'),
  IW = require('../src/index'),
  FakeXHR = require('../src/adapters/json/fakeXHRJson'),
  XHR = require('../src/adapters/json/XHRJson'),
  RequestJSON = require('../src/adapters/json/requestJson');

describe('ironwing', function() {
  describe('#XHR adaptor', function(){
    it('should load JSON adapter by default on nodejs', function() {
      assert.equal(IW.adapters.JSON instanceof RequestJSON, true);
    });
    it('should be able to load an adapter', function() {
      IW.useAdapter('JSON', ['api']);

      assert.equal(IW.adapter instanceof RequestJSON, true);
    });
    it('should be able to parse api addresses correctly', function() {
       IW.useAdapter('JSON', ['api']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['/api']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['api/']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['/api/']);

       assert.equal(IW.adapter.apiUrl, '/api/');

       IW.useAdapter('JSON', ['http://jsonplaceholder.typicode.com']);

       assert.equal(IW.adapter.apiUrl, 'http://jsonplaceholder.typicode.com/');
    });
  });
  describe('#factory method', function() {
    it('factory method returns array or promsie', function() {
      IW.useAdapter('JSON', [pkg.jsonTestServer]);

      var promiseUsers = IW('users'),
          promiseUser = IW('users', 100);

      assert.equal(typeof promiseUsers.then, 'function');
      assert.equal(typeof promiseUser.then, 'function');
    });

    it('should return array for collection', function() {
        return
          IW('users').then((users) => {
            assert.equal(users.length, 999);
            assert.equal(Array.isArray(users), true);
          });

    });

    it('should return object for resource', function() {
      return
        IW('users', 200).then(function(user){
          assert.equal(Array.isArray(user), false);
          assert.equal(user.type, 'users');
        });
    });

    it('should be able to execute GET method on model', function() {
      return
        IW('users', 10).then(function(user){
          var oldUser = user;

          assert.equal(Array.isArray(user), false);
          assert.equal(user.type, 'users');

          user.get();

          assert.equal(JSON.stringify(oldUser), JSON.stringify(user));
        });

    });

    it('should be able to UPDATE a model', function() {
      return
        IW('users', 10).then(function(user){
          var oldUser = user;

          assert.equal(Array.isArray(user), false);
          assert.equal(user.type, 'users');

          user.get();
          user.attr.name = 'New name';

          user.update();

          assert.equal(JSON.stringify(oldUser), JSON.stringify(user));

        });
    });

    it('should be able to update the model after UPDATE', function() {
      var post = IW.storage.find('post.json', 386);

      post.attr.title = 'Bla bla';
      return post.update().then(function(dbPost) {
        assert.equal(post.attr.title, dbPost.attr.title);
      });
    });

    it('should be able to delete a model', function() {
      var promisePosts = IW('post.json');

      return promisePosts.then(function(post){
        post.delete();

        assert.equal(Object.keys(post.attr).length, 0);
      });
    });

    it('should be able to create a model', function() {
      var postPromise = IW.create('post.json', {
        title: 'test',
        blog: {
          site_status: 'active',
          is_default: 1,
          domain: 'ironwing'
        },
        categories: [
          {
            id: '6',
            isChecked: 'true',
            name: 'Home Cinema',
            slug: 'home-cinema'
          },
          {
            id: '6',
            isChecked: 'true',
            name: 'Home Cinema',
            slug: 'home-cinema'
          },{
            id: '6',
            isChecked: 'true',
            name: 'Home Cinema',
            slug: 'home-cinema'
          }
        ],
        created_date: '2015-07-20 16:27:44',
        comments: [],
        slug: 'ironwingjs',
        social_published: true
      });

      return postPromise.then(function(postModel) {
        assert.equal(postModel.attr.id, 1000);
        assert.equal(postModel.attr.hasOwnProperty('createdDate'), true);
        assert.equal(postModel.attr.hasOwnProperty('socialPublished'), true);
        assert.equal(postModel.attr.blog.hasOwnProperty('isDefault'), true);
        assert.equal(postModel.attr.blog.hasOwnProperty('domain'), true);
        assert.equal(postModel.attr.title, 'test');
        assert.equal(postModel.attr.blog.siteStatus, 'active');
      });
    });

    it('should be able to support a full CRUD lifecycle', function() {
      IW.useAdapter('fakeJSON', ['../../demo/api']);

      var postPromise = IW.create('post', {
        title: 'test',
        blog: {
          site_status: 'active',
          is_default: 1,
          domain: 'ironwing'
        },
        categories: [
          {
            id: '6',
            isChecked: 'true',
            name: 'Home Cinema',
            slug: 'home-cinema'
          },
          {
            id: '6',
            isChecked: 'true',
            name: 'Home Cinema',
            slug: 'home-cinema'
          },{
            id: '6',
            isChecked: 'true',
            name: 'Home Cinema',
            slug: 'home-cinema'
          }
        ],
        created_date: '2015-07-20 16:27:44',
        comments: [],
        slug: 'ironwingjs',
        social_published: true
      });

      return postPromise.then(function(postModel) {
        var post = IW.storage.find('post', 1000);

        assert.equal(JSON.stringify(post), JSON.stringify(postModel));

        post.get();

        post.attr.title = 'New title';
        post.attr.blog.siteStatus = 'unactive';

        post.update();

        post.delete();

        post = IW.storage.find('post', 1000);

        assert.equal(!!post, false);
      });

    });
  });
});
