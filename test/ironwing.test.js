var assert = require('assert'),
  IW = require('../src/index'),
  XHR = require('../src/adapters/XHRJson');

describe('ironwing', function() {
  describe('#XHR adaptor', function(){
    it('should load JSON adapter by default', function() {
      assert.equal(IW.adapters.hasOwnProperty('JSON'), true);
      assert.equal(IW.adapters.JSON instanceof XHR, true);
    });
    it('should be able to load an adapter', function() {
      IW.useAdapter('JSON', ['api']);

      assert.equal(IW.adapter instanceof XHR, true);
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
    });
  });
  describe('#factory method', function() {
    it('factory method returns array or promsie', function() {
      IW.useAdapter('JSON', ['../../demo/api']);

      var promisePosts = IW('posts.json'),
          promisePost = IW('post.json');

      assert.equal(typeof promisePosts.then, 'function');
      assert.equal(typeof promisePost.then, 'function');
    });

    it('should return array for collection', function() {
        IW.useAdapter('JSON', ['../../demo/api']);

        var promisePosts = IW('posts.json');

        return promisePosts.then(function(posts){
          assert.equal(posts.length, 2);
          assert.equal(Array.isArray(posts), true);
        });
    });

    it('should return object for resource', function() {
      IW.useAdapter('JSON', ['../../demo/api']);

      var promisePosts = IW('post.json');

      return promisePosts.then(function(post){
        assert.equal(Array.isArray(post), false);
        assert.equal(post.type, 'post.json');
      });
    });

    it('should be able to execute GET method on model', function() {
      var promisePosts = IW('post.json');

      return promisePosts.then(function(post){
        var oldPost = post;

        assert.equal(Array.isArray(post), false);
        assert.equal(post.type, 'post.json');

        post.get();

        assert.equal(JSON.stringify(oldPost), JSON.stringify(post));

      });

    });

    it('should be able to UPDATE a model', function() {
      var promisePosts = IW('post.json');

      return promisePosts.then(function(post){
        var oldPost = post;

        assert.equal(Array.isArray(post), false);
        assert.equal(post.type, 'post.json');

        post.get();
        post.attr.title = 'New title';

        post.update();

        assert.equal(JSON.stringify(oldPost), JSON.stringify(post));

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
      IW.useAdapter('JSON', ['../../demo/api']);

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
        var post = IW.storage.find('post.json', 1000);

        assert.equal(JSON.stringify(post), JSON.stringify(postModel));

        post.get();

        post.attr.title = 'New title';
        post.attr.blog.siteStatus = 'unactive';

        post.update();

        post.delete();

        post = IW.storage.find('post.json', 1000);

        assert.equal(!!post, false);
      });

    });
  });
});
