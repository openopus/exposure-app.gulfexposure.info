Controllers.controller('ShareAppController', function($scope, $transitions, $q, $rootScope, $cordovaContacts) {
  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "flip", direction: "down", duration: 600 }); };

  $scope.share_with_contacts = function() {
    $cordovaContacts.pickContact().then(function (contactPicked) {
      $scope.contact = contactPicked;
    });
  };
});
