Controllers.controller('Home2Controller', function($scope, $location, $state) {
  $scope.go_dashboard = function() { $state.go("app.dashboard"); };
 });
