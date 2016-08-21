Controllers.controller('SurveyController', function($scope, $transitions, $timeout, $stateParams, $q, Survey, ExposureCodename) {
  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "slide", direction: "down" }); };

  $scope.toggle_other = function(question) {
    /* Maybe uncheck other items?  Maybe not? */
  };

  $scope.setup = function() {
    var survey_promise;
    var groups_promise = Survey.get_survey_template();

    if ($stateParams.codename) {
      survey_promise = Survey.get_survey_by_codename($stateParams.codename);
    } else {
      survey_promise = Survey.new_survey();
    }

    $q.all([survey_promise, groups_promise]).then(function(values) {
      var survey = values[0], groups = values[1];
      Survey.zipper(groups, survey.answers);
      var codename_question = Survey.get_question_by_name("Codename");
      if (codename_question) codename_question.answer = survey.user.codename;
      ExposureCodename.set_current(survey.user.codename);
      $scope.survey = survey;
      $scope.groups = groups;
    });
  };

  $scope.setup();
});
