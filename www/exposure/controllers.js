Controllers.controller('ExposureController', function($scope, $transitions) {
  $scope.go_intro = function() { $transitions.go("intro", { type: "fade" }); };
 });
