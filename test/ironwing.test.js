var assert = require('assert'),
  pkg = require('../package.json'),
  IW = require('../src'),
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
    it('should be able to parse api addresses correctly', function(done) {
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
       done();
    });
  });
  describe('#factory method', function() {
    it('factory method returns array or promsie', function(done) {
      IW.useAdapter('JSON', [pkg.jsonTestServer]);

      var promiseUsers = IW('users'),
          promiseUser = IW('users', 100);

      assert.equal(typeof promiseUsers.then, 'function');
      assert.equal(typeof promiseUser.then, 'function');
      done();
    });

    it('should return array for collection', function() {
      return IW('users').then(function(users) {
          assert.equal(users.length, 999);
          assert.equal(Array.isArray(users), true);
        });
    });

    it('should return object for resource', function() {
      return IW('users', 200).then(function(user){
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
      var post = IW.storage.find('users', 380);

      post.attr.title = 'Bla bla';
      return post.update().then(function(dbPost) {
        assert.equal(post.attr.title, dbPost.attr.title);
      });
    });

    it('should be able to delete a model', function() {
      return IW('users', 301).then(function(user){
        user.delete();

        assert.equal(Object.keys(user.attr).length, 0);
      });
    });

    it('should be able to create a model', function() {
      var userPromise = IW.create('users', {
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

      return userPromise.then(function(userModel) {
        assert.equal(userModel.attr.id, 1000);
        assert.equal(userModel.attr.hasOwnProperty('createdDate'), true);
        assert.equal(userModel.attr.hasOwnProperty('socialPublished'), true);
        assert.equal(userModel.attr.blog.hasOwnProperty('isDefault'), true);
        assert.equal(userModel.attr.blog.hasOwnProperty('domain'), true);
        assert.equal(userModel.attr.title, 'test');
        assert.equal(userModel.attr.blog.siteStatus, 'active');
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

      return postPromise.then(function(userModel) {
        var user = IW.storage.find('users', 1000);

        assert.equal(JSON.stringify(user), JSON.stringify(userModel));

        user.get();

        user.attr.title = 'New title';
        user.attr.blog.siteStatus = 'unactive';

        user.update();

        user.delete();

        user = IW.storage.find('users', 1000);

        assert.equal(!!user, false);
      });

    });
  });
});
