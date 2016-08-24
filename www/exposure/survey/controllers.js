Controllers.controller('SurveyController', function($scope, $transitions, $timeout, $stateParams, $q, $api, $location, $http,
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

  $scope.go_dashboard = function() { $scope.submit_survey(true); $transitions.go("dashboard", { type: "slide", direction: "down" }); };

  $scope.groups = groups;

  $scope.pick_one = function(question, option) {
    /* There can be only one. */
    question.options.forEach(function(o) {
      if (o != option)
        o.checked = undefined;
    });
  };

  $scope.setup = function() {
    var survey_promise;
    var update_path = false;

    $scope.get_geolocation();

    if ($stateParams.codename) {
      survey_promise = Survey.get_survey_by_codename($stateParams.codename);
    } else {
      survey_promise = Survey.new_survey();
      update_path = true;
    }

    survey_promise.then(function(survey) {
      Survey.zipper(Survey.groups, survey.answers, { location: $scope.zipcode });
      var codename_question = Survey.get_question_by_name("Codename");
      if (codename_question) codename_question.answer = survey.user.codename;
      ExposureCodename.set_current(survey.user.codename);
      $scope.survey = survey;
      $scope.deferred_survey.resolve(true);
      if (update_path) {
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

  $scope.answer_of_question = function(question) {
    var answer = question.answer || "";

    if (question.seltype == 'fixed') {
      /* Do nothing special. */
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
    var elt, existing;

    if ($event) {
      elt = $event.currentTarget;
      angular.element(elt).addClass("regenerating");
    }

    existing = $scope.survey.codename;

    ExposureCodename.regen(existing).then(function(response) {
      var api_user = response.data;
      $scope.survey.user.codename = api_user.codename;
      $scope.survey.codename = api_user.codename;
      var codename_question = Survey.get_question_by_name("Codename");
      if (codename_question) codename_question.answer = $scope.survey.user.codename;
      ExposureCodename.set_current($scope.survey.user.codename);
      if (elt) {
        angular.element(elt).removeClass("regenerating");
      }
    });
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

    if (questions.length > 0) {
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

  $scope.setup();
});
