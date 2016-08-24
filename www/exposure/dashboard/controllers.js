Controllers.controller('DashboardController', function($scope, $transitions, $q, $rootScope, $stateParams, Survey, ExposureCodename) {


  $scope.show_inline_message = function(id) {
    var elt = angular.element(document.getElementById(id));
    elt.addClass("shown");
  };

  $scope.close_inline_message = function(elt) {
    angular.element(elt).removeClass("shown");
  };
  
  $scope.get_surveys = function() {
    ExposureCodename.get_all();
    var codenames = ExposureCodename.codenames;
    var promises = [];

    for (var i = codenames.length - 1; i >= 0; i--) {
      var promise = Survey.get_survey_by_codename(codenames[i]);
      promises.push(promise);
    };

    $q.all(promises).then(function(surveys) {
      $scope.surveys = surveys;
    });
  };

  $scope.get_birthdate = function(survey) {
    var result = (survey && survey.user) ? survey.user.birthdate : null;

    if (!result) {
      var answer = Survey.get_answer_by_name("Birthdate", survey);
      if (answer) { result = answer.value; }
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
  $scope.go_story = function() { $scope.fade_no_more(); $transitions.go("story", { type: "flip", direction: "right", duration: 600 }); }

  $scope.go_survey = function(codename) {
    $scope.fade_no_more();
    $transitions.go("survey", { type: "slide", direction: "up" }, { codename: codename });
  };

  $scope.on_enter = function() {
    $scope.get_surveys();
    if ($stateParams.show_message) {
      $scope.show_inline_message($stateParams.show_message);
    };
  };

  $rootScope.$on("dashboard.i-fucking-hate-ionic-controller-caching", function() {
    $scope.on_enter();
  });

  $scope.on_enter();
});
