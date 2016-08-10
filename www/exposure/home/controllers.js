Controllers.controller('HomeController', function($scope, $location, $state) {
  var transition_success = function(msg) { console.log("Transitioned: " + msg); };
  var transition_failure = function(msg) { console.error("Transition Failed: " + msg); };

  $scope.go_home2 = function() {
    $state.go("app.home2");
    window.plugins.nativepagetransitions.flip({}, transition_success, transition_failure);
  };

  $scope.go_dashboard = function() {
    $state.go("app.dashboard");
    window.plugins.nativepagetransitions.flip({}, transition_success, transition_failure);
  };

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
 });
