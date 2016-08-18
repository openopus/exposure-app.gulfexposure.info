Controllers.controller('SurveyController', function($scope, $transitions) {
  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "slide", direction: "right" }); };
});
