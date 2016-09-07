Controllers.controller('SurveyController',
function($scope, $transitions, $timeout, $stateParams, $q, $api, $location, $http, $rootScope, $ionicPopup, 
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

      $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng).then(function(reply) {
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

  $scope.go_dashboard = function(skip_submit) {
    if (!skip_submit)
      $scope.submit_survey(true);
    $transitions.go("dashboard", { type: "slide", direction: "down" });
  };

  $scope.delete_survey = function(survey) {
    var codename = Survey.codename_of(survey);
    var popup = $ionicPopup.confirm({
      cssClass: "confirmation-dialog",
      title: "Remove Survey Data",
      template: "Really remove anonymous survey data?"
    });

    popup.then(function(res) {
      if (res) {
        Survey.destroy(survey).then(function() {
          $scope.go_dashboard(true);
        });
      }
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
          if (answer && answer != "")
            answer += (", " + option.name);
          else
            answer += option.name;
        }
      });
    }
    return answer;
  };

  $scope.handle_keydown = function(event) {
    var key = event.key || event.keycode || event.which;

    if ((key == "Enter") || (key == 13)) {
      $scope.blur_others();
      event.preventDefault();
      event.stopPropagation();
      return(false);
    }
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
        var codename_question = Survey.get_question_by_tag("codename", $scope.survey);
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
      var showing;

      for (var i = 0; i < dependents.length; i++) {
        var dep = angular.element(dependents[i]);
        showing = (question.answer == angular.element(dep).attr("dependent-value"));
        if (showing)
          angular.element(dep).css("display", "inherit");
        else
          angular.element(dep).css("display", "none");
      }
    }
  };

  $scope.focus_on_me = function(event, question) {
    $scope.blur_others();

    if (question.other_checked) {
      var dom = event.currentTarget;
      var elt = angular.element(dom);
      var elem_id = elt.attr("id");
      var peer_id = elem_id + "-target";
      var peer = document.getElementById(peer_id);
      peer.focus();
    }
  };

  $scope.blur_others = function() {
    var fields = document.querySelectorAll("[type=date], [type=text], [type=location]");

    for (var i = fields.length - 1; i > -1; i--) {
      fields[i].blur();
    }
  };

  $scope.update_boolean = function(question) {
    $scope.blur_others();
    question.answer = question.checked ? "Yes" : "No";
    if (question.has_dependents)
      $scope.hide_show_dependents(question);
  };

  $scope.pick_one = function(question, option) {
    /* There can be only one. */
    $scope.blur_others();
    question.options.forEach(function(o) {
      if (o != option)
        o.checked = undefined;
    });

    if (option.checked) {
      question.answer = option.name;
    } else {
      question.answer = null;
    }
    if (question.has_dependents)
      $scope.hide_show_dependents(question);
  };

  $scope.submit_survey_button = function() {
    $scope.submit_survey(false);
  };

  $scope.submit_survey = function(skip_trans) {
    var questions, answers = [];

    try {
      questions = Survey.get_questions($scope.survey);
    } catch(e) {
      questions = [];
    }

    questions.forEach(function(question) {
      var answer = $scope.answer_of_question(question);
      // console.log("SUBMIT - " + question.tag + ": " + answer);
      if (answer)
        answers.push({ survey_question_id: question.id, value: answer });
      question.answer = answer;
    });

    $scope.survey.answers = answers;
    Survey.set_status($scope.survey);

    if ($scope.survey.status == "complete") {
      $rootScope.$broadcast("dashboard.show-message", { message: "complete-survey-message", codename: $scope.survey.codename });
    } else {
      $rootScope.$broadcast("dashboard.show-message", { message: "incomplete-survey-message", codename: $scope.survey.codename });
    }

    if (answers.length > 1) {
      $api.post("survey_submit", { codename: Survey.codename_of($scope.survey), answers: answers }).then(function(response) {
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
    var survey_promise;

    /* It feels too aggressive to ask for the user's location in order to "track them while they are using the app". */
    /* The language around the whole thing is kind of a nightmare.  We can ask a nicer question first, and see if they
     * say "Yes" to that.  Would like to ask for different permissions. */
    $scope.get_geolocation();

    if ($stateParams.codename) {
      survey_promise = Survey.get_survey_by_codename($stateParams.codename);
    } else {
      survey_promise = Survey.new_survey();
      update_path = true;
    }

    survey_promise.then(function(survey) {
      if (!survey.user) { $scope.go_dashboard(true); return; }
      var codename_question = Survey.get_question_by_tag("codename", survey);
      codename_question.answer = survey.user.codename;
      ExposureCodename.set_current(survey.user.codename);

      $scope.survey = survey;
      $scope.deferred_survey.resolve(true);

      var questions = Survey.get_questions(survey);

      /* We have wrapped this in a $timeout of 0 because the DOM hasn't been rendered yet!
       * The $timeout give this "digest cycle" a chance to finish, and once the DOM has
       * been rendered, the ability to find the DOM elements that we want to manipulate
       * can work.  Alternatively, we could have a more complex system, in which we arrange
       * to let angular do everything for us - once we have connected everything as we
       * are doing here.  This sucks, but it's the "best way".
       * (bfox: Mon Aug 29 07:56:17 2016) */
      $timeout(function(surprise) {
        questions.forEach(function(q) {
          if (q.has_dependents) {
            $scope.hide_show_dependents(q);
          }
        });
      }, 0);

      /* Don't do this in production.  It was a helper for development. */
      if (!window.cordova && update_path) {
        $location.path("/survey/" + survey.user.codename);
      }
    });

    $q.all([$scope.deferred_survey.promise, $scope.deferred_location.promise]).then(function(values) {
      var location_questions = Survey.get_questions_by_seltype("location", $scope.survey);
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
