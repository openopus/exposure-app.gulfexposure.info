Controllers.controller('HomeController', function($scope, $location, $state) {
  $scope.go_home2 = function() { $state.go("app.home2"); };
  $scope.go_dashboard = function() { $state.go("app.dashboard"); };
 });
