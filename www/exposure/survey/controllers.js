Controllers.controller('SurveyController', function($scope, $transitions, $timeout, $stateParams, $q, $api, $location, groups, Survey, ExposureCodename) {
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
      Survey.zipper(Survey.groups, survey.answers);
      var codename_question = Survey.get_question_by_name("Codename");
      if (codename_question) codename_question.answer = survey.user.codename;
      ExposureCodename.set_current(survey.user.codename);
      $scope.survey = survey;
      if (update_path) {
        $location.path("/survey/" + survey.user.codename);
      }
    });
  };

  $scope.answer_of_question = function(question) {
    var answer = question.answer || "";

    if (question.seltype == 'fixed') {
      /* Do nothing special. */
    } else if (question.seltype.startsWith('pick')) {
      question.options.forEach(function(option) {
        if (option.checked) {
          answer += (", " + option.name);
        }
      });
    }
    return answer;
  };

  $scope.submit_survey = function() {
    var questions = Survey.get_questions($scope.survey.groups);
    var answers = [];

    questions.forEach(function(question) {
      var answer = $scope.answer_of_question(question);
      answers.push({ question_id: question.id, answer: answer });
    });

    $api.post("survey_submit", { codename: $scope.survey.codename, answers: answers }).then(function(response) {
      Survey.remove_survey_by_codename($scope.survey.codename);
      $scope.go_dashboard();
    });
  };

  $scope.setup();
});
