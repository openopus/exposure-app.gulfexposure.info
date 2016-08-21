App.filter('asAge', function() {
  return function(input) {
    var output = '??';
    var birthdate = input;

    if (birthdate) {
      if (typeof birthdate == "string") { birthdate = new Date(input + " PST"); }
      var ms_diff = Date.now() - birthdate.getTime();
      var age = new Date(ms_diff);
      output = "" +  (Math.abs(age.getUTCFullYear() - 1970));
    }

    return output;
  };
});

Controllers.controller('DashboardController', function($scope, $transitions, $q, $rootScope, Survey, ExposureCodename) {

  /* When this dashboard loads - immediately load the Survey data so there's no waiting. */
  Survey.get_survey_template().then(function(groups) {});

  $scope.get_surveys = function() {
    ExposureCodename.get_all().then(function(data) {
      var codenames = data;
      var promises = [];

      for (var i = codenames.length - 1; i >= 0; i--) {
        var promise = Survey.get_survey_by_codename(codenames[i]);
        promises.push(promise);
      };

      $q.all(promises).then(function(surveys) {
        $scope.surveys = surveys;
      });
    });
  };

  $scope.fade_no_more = function() {
    var items = document.getElementsByClassName("slow-fadein");
    while (items.length > 0) {
      angular.forEach(items, function(item) {
        angular.element(item).removeClass("slow-fadein");
      });
      items = document.getElementsByClassName("slow-fadein");
    }
  };

  $scope.go_map = function() { $scope.fade_no_more(); $transitions.go("map", { type: "slide", direction: "down" }); };
  $scope.go_blog = function() { $scope.fade_no_more(); $transitions.go("blog"); };
  $scope.go_create = function() { $scope.fade_no_more(); $transitions.go("blog_create", { type: "flip", direction: "right", duration: 600 }); };
  $scope.go_story = function() { $scope.fade_no_more(); $transitions.go("story", { type: "flip", direction: "right", duration: 600 }); }

  $scope.go_survey = function(codename) {
    $scope.fade_no_more();
    $transitions.go("survey", { type: "slide", direction: "up" }, { codename: codename });
  };

  $scope.get_surveys();

  $rootScope.$on("dashboard.i-fucking-hate-ionic-controller-caching", function() {
    $scope.get_surveys();
  });
});

