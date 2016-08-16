angular.module('posts_controller', [])

.controller('PostsCtrl', function($scope, Posts) {

  Posts.getPosts().then(function(posts){
    $scope.posts = posts;
    console.log($scope.posts[0]);
  });
  $scope.remove = function(post) {
    Posts.remove(post);
  };

})
