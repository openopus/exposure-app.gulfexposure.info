Controllers.controller('DashboardController', function($scope, $location, $state) {
  $scope.go_survey = function() { $state.go("app.survey"); };
  $scope.go_map = function() { $state.go("app.map"); };
  $scope.go_blog = function() { $state.go("app.blog"); };
 });
