Controllers.controller('DashboardController', function($scope, $location, $state, $ionicHistory, $transitions) {
  $ionicHistory.clearHistory();

  $scope.go_survey = function() { $transitions.go("app.survey", { type: "slide", direction: "up" }); };
  $scope.go_map = function() { $transitions.go("app.map", { type: "slide", direction: "down" }); };
  $scope.go_blog = function() { $transitions.go("app.blog"); };
  $scope.go_intro = function() { $transitions.go("story", { type: "fade" }); }
});
