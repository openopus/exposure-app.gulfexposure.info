//services.js: -*- JavaScript-IDE -*-  DESCRIPTIVE TEXT.
//
// Copyright (c) 2016 Brian J. Fox
// Author: Brian J. Fox (bfox@opuslogica.com) Mon Aug 15 18:18:11 2016.
var OLIWPServices = angular.module('oli.wordpress_services', []);

OLIWPServices.factory('$localstorage', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  };
});


OLIWPServices.factory('Posts', function($http) {
  var wordpress_url = "http://therisingmovie.info/wp-json/wp/v2/posts/";
  var posts = [];

  return {
    all: function() {
      return posts;
    },
    remove: function(post) {
      posts.splice(posts.indexOf(post), 1);
    },

    getPost: function(id) {
      var post = null;

      angular.forEach(posts, function(p) {
        if (p.id == id) {
          post = p;
        }
      });
      return post;
    },

    getPosts: function(scope) {
      var transformResponse = function(value) {
        var result = null;
        try {
          result = JSON.parse(value);
        } catch(e) {
          if (scope != undefined) {
            scope.OLIWPServicesError = value;
          }
        };

        return result;
      };

      return $http.get(wordpress_url, { transformResponse: transformResponse })
        .then(function(response) {
          posts = response.data;
          return posts;
        });
      //.error(function(response, status){
      //  console.log("Error while received response. " + status + response);
      //});
    },

    createPost: function(title, content, image) {
      var authdata = "cmlzaW5nQ29udHJpYnV0b3I6ZVRzd1cmTmFrQkJQeCZaZTN4UjNVMUsx";
      var data = { title: title, content: content };
      var config = { headers: { 'Authorization': 'Basic ' + authdata } };

      return $http.post(wordpress_url, data, config);
    }
  };
});

