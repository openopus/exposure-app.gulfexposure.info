var PostServices = angular.module('posts.services', []);

PostServices.factory('Posts', function($http) {
  var wordpress_url = "http://therisingmovie.info/wp-json/wp/v2/posts ";
  var posts = [];

  return {
    all: function() {
      return posts;
    },
    remove: function(post) {
      posts.splice(posts.indexOf(post), 1);
    },
    getPost: function(index){
      return posts[index];
    },
    getPosts: function() {
      return $http.get(wordpress_url)
        .then(function(response){
          posts = response.data;
          return posts;
        });
        //.error(function(response, status){
        //  console.log("Error while received response. " + status + response);
        //});
    }
  };
});
