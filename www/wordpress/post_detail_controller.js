angular.module('post_detail_controller', [])

  .controller('PostDetailCtrl', function($scope, $stateParams, Posts, $sce) {
  var post = Posts.getPost($stateParams.postId);
  var parser = new DOMParser();
  var doc = parser.parseFromString(post.content.rendered, 'text/html');
  $scope.posts = [];

  class_list = doc.querySelector("img").classList;
  class_list.value = "some_class";

  post.post_content = $sce.trustAsHtml(doc.firstChild.outerHTML);
  $scope.post = post;
})
