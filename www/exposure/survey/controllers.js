Controllers.controller('SurveyController', function($scope, $transitions, $timeout, $stateParams, $q, $api, $location, $http, $rootScope,
                                                    groups, Survey, ExposureCodename, ExposureUser) {

  $scope.deferred_location = $q.defer();
  $scope.deferred_survey = $q.defer();

  $scope.get_geolocation = function() {
    var Geolocation = navigator.geolocation;

    var success = function(position) {
      $scope.position = position;
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var latlng = lat + "," + lon;

      $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=true").then(function(reply) {
        var data = reply.data;

        if (data.status && data.status == "OK") {
          try {
            var comp = data.results[0].address_components;
            var city = "";
            var state = "";

            for (var i = comp.length - 1; i >= 0; i--) {
              if (comp[i].types[0] == "postal_code") {
                $scope.zipcode = comp[i].short_name;
              } else if (comp[i].types[0] == "locality") {
                city = comp[i].short_name;
              } else if (comp[i].types[0] == "administrative_area_level_1") {
                state = comp[i].short_name;
              }
            }

            $scope.location = city + ", " + state;
            $scope.address = data.results[0].formatted_address;
            $scope.deferred_location.resolve(true);
          } catch (e) {
            console.log("Who knows what evil lurks in the hearts of men?", e);
          }
        }
      });
    };

    var failure = function(err) { console.log("surveyController: Error getting geo location", err); };

    Geolocation.getCurrentPosition(success, failure);
  };

  $scope.go_dashboard = function() {
    $scope.submit_survey(true);
    $transitions.go("dashboard", { type: "slide", direction: "down" });
  };

  $scope.groups = groups;

  $scope.pick_one = function(question, option) {
    /* There can be only one. */
    question.options.forEach(function(o) {
      if (o != option)
        o.checked = undefined;
    });
  };

  $scope.answer_of_question = function(question) {
    var answer = question.answer || "";

    if (question.seltype == 'fixed' || question.seltype == "boolean") {
      /* Do nothing special, question.answer is already the right thing. */
    } else if (question.seltype.startsWith('pick')) {
      if (!question.other_checked) answer = "";
      question.options.forEach(function(option) {
        if (option.checked) {
          answer += (", " + option.name);
        }
      });
    }
    return answer;
  };

  $scope.regen_codename = function($event) {
    var existing = $scope.survey.codename;
    var elt;

    if ($event) {
      elt = $event.currentTarget;
      angular.element(elt).addClass("regenerating");
    }

    var do_regen = function() {
      ExposureCodename.regen(existing).then(function(response) {
        var api_user = response.data;
        $scope.survey.user.codename = api_user.codename;
        $scope.survey.codename = api_user.codename;
        var codename_question = Survey.get_question_by_tag("codename");
        if (codename_question) codename_question.answer = $scope.survey.user.codename;
        ExposureCodename.set_current($scope.survey.user.codename);
        if (elt) {
          angular.element(elt).removeClass("regenerating");
        }
      });
    };

    $timeout(do_regen, 800);
  };

  $scope.hide_show_dependents = function(question) {
    var dependents = document.querySelectorAll("[dependent-on='" + question.tag + "']");

    if (dependents) {
      var showing = question.checked;

      for (var i = 0; i < dependents.length; i++) {
        var dep = dependents[i];
        if (showing)
          angular.element(dep).css("display", "inherit");
        else
          angular.element(dep).css("display", "none");
      }
    }
  };

  $scope.update_boolean = function(question) {
    $scope.hide_show_dependents(question);
  };

  $scope.submit_survey_button = function() {
    $scope.submit_survey(false);
  };

  $scope.submit_survey = function(skip_trans) {
    var questions, answers = [];

    try {
      questions = Survey.get_questions($scope.survey.groups);
    } catch(e) {
      questions = [];
    }

    questions.forEach(function(question) {
      var answer = $scope.answer_of_question(question);
      answers.push({ question_id: question.id, answer: answer });
    });

    Survey.zipper($scope.survey.groups, answers);

    var actually_answered = 0;
    answers.forEach(function(ans) { if (ans.answer && ans.answer != "") actually_answered++; });

    // console.log("Questions.length: " + questions.length + " - Answers.length " + answers.length + " - Actual " + actually_answered);
    // console.log("answers", answers);

    if (actually_answered >= questions.length) {
      $rootScope.$broadcast("dashboard.show-message", { message: "complete-survey-message", codename: $scope.survey.codename });
    } else {
      $rootScope.$broadcast("dashboard.show-message", { message: "incomplete-survey-message", codename: $scope.survey.codename });
    }

    if (answers.length > 1) {
      $api.post("survey_submit", { codename: $scope.survey.codename, answers: answers }).then(function(response) {
        Survey.remove_survey_by_codename($scope.survey.codename);
        if (!skip_trans)
          $transitions.go("dashboard", { type: "slide", direction: "down" });
      });
    } else {
      if (!skip_trans) {
        $transitions.go("dashboard", { type: "slide", direction: "down" });
      }
    }
  };
  
  $scope.setup = function() {
    var update_path = false;
    var promises = [];

    $scope.get_geolocation();

    if ($stateParams.codename) {
      promises.push(Survey.get_survey_by_codename($stateParams.codename));
      promises.push(ExposureUser.get_by_codename($stateParams.codename));
    } else {
      promises.push(Survey.new_survey());
      update_path = true;
    }

    $q.all(promises).then(function(values) {
      var survey = values[0];
      var user = values[1] ? values[1] : survey.user;

      if (!survey.user) survey.user = user;
      Survey.zipper(Survey.groups, survey.answers, { location: $scope.zipcode });

      var codename_question = Survey.get_question_by_tag("codename");
      if (survey.user && codename_question) {
        codename_question.answer = survey.user.codename;
        ExposureCodename.set_current(survey.user.codename);
      } else if (codename_question) {
        codename_question.answer = "<no-codename>";
      }

      $scope.survey = survey;
      $scope.deferred_survey.resolve(true);

      var questions = Survey.get_questions(survey.groups);
      questions.forEach(function(q) {
        if (q.seltype == "boolean") {
          $scope.hide_show_dependents(q);
        }
      });

      /* Don't do this in production.  It was a helper for development. */
      if (!window.cordova && update_path) {
        $location.path("/survey/" + survey.user.codename);
      }
    });

    $q.all([$scope.deferred_survey.promise, $scope.deferred_location.promise]).then(function(values) {
      var location_questions = Survey.get_questions_by_seltype("location", $scope.survey.groups);
      location_questions.forEach(function(question) {
        if (!question.answer) {
          if ($scope.location && $scope.location != ", ")
            question.answer = $scope.location;
          else
            question.answer = $scope.zipcode;
        }
      });
    });
  };

  $scope.setup();
});
