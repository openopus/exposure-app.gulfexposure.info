Controllers.controller('SurveyController', function($scope, $transitions, $timeout, Survey) {
  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "slide", direction: "down" }); };

  $scope.toggle_other = function(question) {
    /* Maybe uncheck other items?  Maybe not? */
  };

  Survey.get_survey().then(function(groups) {
    $scope.groups = groups;
  });

});
