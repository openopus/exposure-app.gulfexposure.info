Controllers.controller('HomeController', function($scope, $location, $state) {

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

  $scope.transition = function(opts) {
    var transition_success = function(msg) { /* console.log("Transitioned: " + msg); */ };
    var transition_failure = function(msg) { console.error("Transition Failed: " + msg); };
    if (opts == undefined) { opts = { direction: "left" }; }
    try {
      window.plugins.nativepagetransitions.slide(opts, transition_success, transition_failure);
    } catch(x) {
      console.log("Missing nativepagetransitions");
    }
  }
  $scope.go_home2 = function() {
    $scope.accelerate();
    $state.go("app.home2");
    $scope.transition();
  };

  $scope.go_dashboard = function() {
    $scope.accelerate();
    $state.go("app.dashboard");
    $scope.transition({ direction: "up" })
  };
 });
