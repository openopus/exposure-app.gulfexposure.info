Controllers.controller('DashboardController', function($scope, $transitions, $q, $rootScope, $stateParams, $timeout, Survey, ExposureCodename, Posts) {
  $scope.show_inline_message = function(id) {
    var raw = document.getElementById(id);
    if (raw) {
      var elt = angular.element(raw);
      elt.addClass("messaage-shown");
      $scope.inline_message_showing = true;
      // $timeout(function() { elt.removeClass("message-shown"); }, 5000);
    }
  };

  $scope.close_inline_message = function(event) {
    angular.element(event.currentTarget).parent().removeClass("message-shown");
    $scope.inline_message_showing = false;
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
    });
  };

  $scope.get_birthdate = function(survey) {
    var result = (survey && survey.user) ? survey.user.birthdate : null;

    if (!result) {
      result = Survey.get_value_by_tag("birthdate", survey);
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
    $transitions.go("survey", { type: "slide", direction: "up" }, { codename: codename });
  };

  $scope.on_enter = function() {
    $scope.get_surveys();
  };

  $rootScope.$on("dashboard.i-fucking-hate-ionic-controller-caching", $scope.on_enter);
  $rootScope.$on("dashboard.show-message", function(event, args) {
    if (args && args.message) $scope.show_inline_message(args.message);
    if (args && args.codename) $scope.messaged_codename = args.codename;
  });

  /* The following code is only executed when this controller is created. */
  Posts.all();
  $scope.on_enter();
});
