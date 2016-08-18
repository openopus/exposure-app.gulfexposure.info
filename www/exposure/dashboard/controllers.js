Controllers.controller('DashboardController', function($scope, $location, $state, $ionicHistory, $transitions) {
  $ionicHistory.clearHistory();

  $scope.fade_no_more = function() {
    var items = document.getElementsByClassName("slow-fadein");
    while (items.length > 0) {
      angular.forEach(items, function(item) {
        angular.element(item).removeClass("slow-fadein");
      });
      items = document.getElementsByClassName("slow-fadein");
    }
  };

  $scope.go_survey = function() { $scope.fade_no_more(); $transitions.go("survey", { type: "slide", direction: "up" }); };
  $scope.go_map = function() { $scope.fade_no_more(); $transitions.go("map", { type: "slide", direction: "down" }); };
  $scope.go_blog = function() { $scope.fade_no_more(); $transitions.go("blog"); };
  $scope.go_create = function() { $scope.fade_no_more(); $transitions.go("blog_create", { type: "flip", direction: "left", duration: 600 }); };
  $scope.go_story = function() { $scope.fade_no_more(); $transitions.go("story", { type: "flip", direction: "right", duration: 600 }); }
});
