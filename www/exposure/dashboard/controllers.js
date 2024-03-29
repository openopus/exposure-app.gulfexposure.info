Controllers.controller('DashboardController', function($scope, $transitions, $q, $rootScope, $stateParams, $timeout, Survey, ExposureCodename, Posts, $push) {
  $scope.show_inline_message = function(id) {
    $scope.current_message = id;
    var raw = document.getElementById(id);
    if (raw) {
      var elt = angular.element(raw);
      elt.addClass("message-shown");
      $scope.inline_message_showing = true;
      $scope.blurb_or_button();
      // $timeout(function() { elt.removeClass("message-shown"); }, 5000);

      if (id == "submitted-story-message") {
        $push.ask_for_permission("Would you like to be notified if your story is selected for the blog?");
      }
    }
  };

  $scope.close_inline_message = function(event) {
    angular.element(event.currentTarget).parent().removeClass("message-shown");
    $scope.inline_message_showing = false;
    $scope.blurb_or_button();
  };

  $scope.close_all_inline_messages = function() {
    var open_elements = document.getElementsByClassName("message-shown");

    for (var i = 0; open_elements && i < open_elements.length; i++) {
      angular.element(open_elements[i]).removeClass("message-shown");
    }
  };
  
  $scope.blurb_or_button = function() {
    if ($scope.inline_message_showing) {
      $scope.show_blurb = false;
      $scope.show_share = false;
    } else if (!$scope.surveys || $scope.surveys.length == 0) {
      $scope.show_blurb = true;
      $scope.show_share = false;
    } else if ($scope.surveys.length == 1) {
      $scope.show_blurb = false;
      $scope.show_share = true;
    } else {
      $scope.show_blurb = false;
      $scope.show_share = true;
    }
  };

  $scope.get_surveys = function() {
    ExposureCodename.get_all();
    var codenames = ExposureCodename.codenames;
    var promises = [];

    for (var i = 0, l = codenames.length; i < l; i++) {
      var promise = Survey.get_survey_by_codename(codenames[i]);
      promises.push(promise);
    };

    $q.all(promises).then(function(surveys) {
      if (surveys) {
        for (var i = surveys.length; i >= 0; i--) {
          if (!surveys[i] || !surveys[i].user) {
            surveys.splice(i, 1);
          } else {
            Survey.set_status(surveys[i]);
          }
        }
      }
      $scope.surveys = surveys;
      $scope.blurb_or_button();
    }).catch(function(errors) {
      console.log("ERRORS GETTING SURVEYS:", errors);
      $scope.surveys = [];
      $scope.blurb_or_button();
    }).finally(function() {
      // console.log("IN THE FINALLY BLOCK");
    });
  };

  $scope.get_birthdate = function(survey) {
    var result = (survey && survey.user) ? survey.user.birthdate : null;

    if (!result) {
      result = Survey.get_value_by_tag("current-age", survey);
    }

    return result;
  }

  $scope.fade_no_more = function() {
    var items = document.getElementsByClassName("slow-fadein");
    while (items.length > 0) {
      angular.forEach(items, function(item) {
        angular.element(item).removeClass("slow-fadein");
      });
      items = document.getElementsByClassName("slow-fadein");
    }
  };

  $scope.go_map = function() { $scope.fade_no_more(); $transitions.go("map", { type: "slide", direction: "left" }); };
  $scope.go_blog = function() { $scope.fade_no_more(); $transitions.go("blog"); };
  $scope.go_create = function() { $scope.fade_no_more(); $transitions.go("blog_create", { type: "slide", direction: "up" }); };
  $scope.go_why = function() { $scope.fade_no_more(); $transitions.go("why", { type: "flip", direction: "right", duration: 600 }); }
  $scope.go_share = function() { $scope.fade_no_more(); $transitions.go("share", { type: "flip", direction: "up", duration: 600 }); }

  $scope.go_survey = function(codename) {
    $scope.fade_no_more();
    $scope.close_all_inline_messages();
    $transitions.go("survey", { type: "slide", direction: "up" }, { codename: codename });
  };

  $scope.on_enter = function() {
    $scope.get_surveys();
  };

  $rootScope.$on("dashboard.i-fucking-hate-ionic-controller-caching", $scope.on_enter);
  $rootScope.$on("dashboard.show-message", function(event, args) {
    if (args && args.message) { $timeout(function() { $scope.show_inline_message(args.message); }, 0); }
    if (args && args.codename) $scope.messaged_codename = args.codename;
  });

  /* The following code is only executed when this controller is created. */
  Posts.all();
  $scope.on_enter();
});
