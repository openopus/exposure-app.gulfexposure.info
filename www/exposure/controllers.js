//controllers.js: -*- JavaScript-IDE -*-  DESCRIPTIVE TEXT.
//
// Copyright (c) 2016 Brian J. Fox
// Author: Brian J. Fox (bfox@opuslogica.com) Tue Sep  6 06:02:21 2016.
Controllers.controller("appController", function($app, $scope, $rootScope, $cordovaNetwork) {
  $scope.network = $app.network;
  $scope.online = $app.online;

  $rootScope.$on("$app:network-online", function() { $scope.network = $app.network; $scope.online = $app.online; });
  $rootScope.$on("$app:network-offline", function() { $scope.network = $app.network; $scope.online = $app.online; });
});
