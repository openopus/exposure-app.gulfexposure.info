var OLIWordpress = angular.module('oli.wordpress', []);

OLIWordpress.factory('Posts', function($http, $q) {
  var service = { url: "http://therisingmovie.info/wp-json/wp/v2/posts/", posts: [] };

  service.all = function(force) {
    var defer = $q.defer()
    var result = defer.promise;

    if (force || service.posts.length == 0) {
      var transformResponse = function(value) {
        var result = null;
        try { result = JSON.parse(value); } catch(e) {
          console.log("OLIWordpress:Posts.all(...): ", e);
        }
        return result;
      };

      $http.get(service.url, { transformResponse: transformResponse }).then(function(response) {
        service.posts = response.data;
        defer.resolve(service.posts);
      });
    } else {
      defer.resolve(service.posts);
    }
    return result;
  };

  service.remove = function(post) {
    service.posts.splice(service.posts.indexOf(post), 1);
  };

  service.get = function(id) {
    var defer = $q.defer();
    var result = defer.promise;
    var post = null;

    for (var i = service.posts.length - 1; i >= 0; i--) {
      if (service.posts[i].id == id) {
        post = service.posts[i];
        break;
      }
    }

    if (post) {
      defer.resolve(post);
    } else {
      $http.get(service.url + id).then(function(response) {
        post = response.data;
        service.posts.push(post);
        defer.resolve(post);
      });
    }

    return result;
  };

  service.createPost = function(title, content, image) {
    var authdata = "cmlzaW5nQ29udHJpYnV0b3I6ZVRzd1cmTmFrQkJQeCZaZTN4UjNVMUsx";
    var data = { title: title, content: content };
    var config = { headers: { 'Authorization': 'Basic ' + authdata } };

    return $http.post(service.url, data, config);
  };

  return service;
});

App.requires.push('oli.wordpress');
