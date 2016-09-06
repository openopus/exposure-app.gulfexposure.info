//controllers.js: -*- JavaScript-IDE -*-  DESCRIPTIVE TEXT.
//
// Copyright (c) 2016 Brian J. Fox
// Author: Brian J. Fox (bfox@opuslogica.com) Tue Sep  6 06:02:21 2016.
Controllers.controller("appController", function($app, $scope) {
  $scope.online = window.navigator ? window.navigator.onLine : true;;
  $scope.network = "wifi";

  document.addEventListener("online", function(network_type) { $scope.network = network_type.type; $scope.online = true; });
  document.addEventListener("offline", function(network_type) { $scope.network = network_type.type; $scope.online = false; });
});
