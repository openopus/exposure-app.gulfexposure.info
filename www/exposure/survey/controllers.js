Controllers.controller('SurveyController', function($scope, $transitions, $timeout, $stateParams, $q, $location, groups, Survey, ExposureCodename) {
  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "slide", direction: "down" }); };
  $scope.groups = groups;

  $scope.toggle_other = function(question) {
    /* Maybe uncheck other items?  Maybe not? */
  };

  $scope.setup = function() {
    var survey_promise;
    var update_path = false;

    if ($stateParams.codename) {
      survey_promise = Survey.get_survey_by_codename($stateParams.codename);
    } else {
      survey_promise = Survey.new_survey();
      update_path = true;
    }

    survey_promise.then(function(survey) {
      Survey.zipper(groups, survey.answers);
      var codename_question = Survey.get_question_by_name("Codename");
      if (codename_question) codename_question.answer = survey.user.codename;
      ExposureCodename.set_current(survey.user.codename);
      $scope.survey = survey;
      if (update_path) {
        $location.path("/survey/" + survey.user.codename);
      }
    });
  };

  $scope.setup();
});
