Controllers.controller("appController", function($app, $scope, $push, $ionicPlatform) {
  $scope.online = window.navigator ? window.navigator.onLine : true;;
  $scope.network = "wifi";

  document.addEventListener("online", function(network_type) { $scope.network = network_type.type; $scope.online = true; });
  document.addEventListener("offline", function(network_type) { $scope.network = network_type.type; $scope.online = false; });
});
