Controllers.controller('ShareAppController', function($scope, $transitions, $q, $rootScope, $cordovaContacts, $cordovaSocialSharing, $cordovaEmailComposer) {

  $scope.exposure_rated = localStorage.getItem("exposure-rated");
  $scope.share_body = "<p>This impacted me, and I thought I'd share.  This app is helping to expose the relationship between oil spills and unual illnesses and health problems.</p><p>You can find out more about the app from here: <a href='http://theexposureapp.com'>http://theexposureapp.com</a>.";
  $scope.go_dashboard = function(show_message) {
    if (show_message) {
      var message = "thanks-for-sharing-message";
      if (typeof show_message == "string") message = show_message;
      $rootScope.$broadcast("dashboard.show-message", { message: message });
    }

    $transitions.go("dashboard", { type: "flip", direction: "down", duration: 600 });
  };

  $scope.rate_this_app = function() {
    try {
      AppRate.preferences.callbacks.onButtonClicked = function(button_index) {
        console.log("RATING BUTTON: " + button_index);
        if (button_index == 1) {
          localStorage.setItem("exposure-rated", "true");
          $scope.exposure_rated = true;
          $scope.go_dashboard("thanks-for-rating-this-app-message");
        }
      };

      AppRate.promptForRating();
    } catch(e) {
      console.log("Error rating: " + e);
      $scope.go_dashboard();
    }
  };

  $scope.share_this_app = function() {
    var onSuccess = function(result) {
      console.log("Successfully shared.");
      $scope.go_dashboard(true);
    };
    var onFailure = function(error) {
      console.log("Share: got error: " + error);
      $scope.go_dashboard();
    };
    var options = { url: "http://theexposureapp.com/",
                    subject: "Check out this app for helping oil spill victims...",
                    message: "This impacted me, and I thought I'd share.  This app is helping to expose the relationship between oil spills and unusual illnesses and health problems." };

    try {
      $cordovaSocialSharing.shareWithOptions(options, onSuccess, onFailure);
    } catch(e) {
      console.log("Couldn't call share function: " + e);
      $scope.go_dashboard();
    }
  };


  $scope.share_with_contacts = function() {
    try {
      $cordovaContacts.pickContact().then(function (contactPicked) {
        $scope.contact = contactPicked;
        console.log("Got this contact: ", contactPicked);
        var email = contactPicked.emails[0].value;
        var opts = {
          to: contactPicked.displayName + " <" + email + ">",
          subject: "Check out this app for helping oil spill victims...",
          body: $scope.share_body
        };
        
        $cordovaEmailComposer.open(opts).then(function() {
          $scope.go_dashboard(true);
        });
      });
    } catch (e) {
      console.log("Must be in a browser.");
      $scope.go_dashboard(true);
    }
  };

  $scope.email_the_exposure = function() {
    var opts = {
        to: ["The Exposure <info@theexposureapp.com>"],
        subject: "Email from a user of The Exposure App",
        body: "Say what you need to!"
    }
    try {
      $cordovaEmailComposer.open(opts).then(function() {
        $scope.go_dashboard("thanks-for-sending-us-email-message");
      });
    } catch(e) {
      console.log(e);
      $scope.go_dashboard();
    }
  };
});
