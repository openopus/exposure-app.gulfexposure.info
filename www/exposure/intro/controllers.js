Controllers.controller('IntroController', function($scope, $location, $state, $transitions) {

  $scope.accelerate = function() {
    var raw_elements = document.getElementsByClassName("dramatic-paragraph");
    angular.forEach(raw_elements, function(raw) {
      var element = angular.element(raw);
      element.removeClass("delay-1");
      element.removeClass("delay-2");
      element.removeClass("delay-3");
      element.removeClass("delay-4");
      element.removeClass("delay-5");
      element.removeClass("delay-6");
      element.removeClass("delay-7");
      element.removeClass("slow-fadein");
      element.addClass("smooth-fadein");
    });

    raw_elements = document.getElementsByClassName("delay-7");
    angular.forEach(raw_elements, function(raw) {
      var element = angular.element(raw);
      element.removeClass("delay-7");
    });
  }

  $scope.go_home2 = function() {
    $scope.accelerate();
    $transitions.go("story.page1");
  };

  $scope.go_dashboard = function() {
    $scope.accelerate();
    $transitions.go("app.dashboard");
  };
});
