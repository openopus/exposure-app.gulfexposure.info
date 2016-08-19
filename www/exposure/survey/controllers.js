Controllers.controller('SurveyController', function($scope, $transitions, $timeout, Survey) {
  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "slide", direction: "down" }); };
  Survey.get_survey().then(function(groups) {
    $scope.groups = groups;
  });
});
