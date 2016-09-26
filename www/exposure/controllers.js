Controllers.controller("appController", function($app, $scope, $push, $ionicPlatform, $timeout) {
  $scope.online = window.navigator ? window.navigator.onLine : true;;
  $scope.network = "wifi";

  document.addEventListener("online", function(network_type) { $scope.network = network_type.type; $scope.online = true; });
  document.addEventListener("offline", function(network_type) { $scope.network = network_type.type; $scope.online = false; });

  $scope.push_notification_message_handler = function(message) {
    $scope.$apply(function() {
      $scope.notification_message = message;
    });

    // $scope.default_message_handler(message);
    $timeout(function() { $scope.notification_message = null; }, 10000);
  };

  $scope.default_message_handler = $push.default_message_handler;
  $push.default_message_handler = $scope.push_notification_message_handler;
});
