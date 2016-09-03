Controllers.controller('ShareAppController', function($scope, $transitions, $q, $rootScope, $ionicActionSheet,
                                                      $cordovaSms, $cordovaContacts, $cordovaSocialSharing, $cordovaEmailComposer) {

  $scope.exposure_rated = localStorage.getItem("exposure-rated");
  $scope.share_body = "<p>This impacted me, and I thought I'd share.  This app is helping to expose the relationship between oil spills and unusual illnesses and health problems.</p><p>You can find out more about the app from here: <a href='http://theexposureapp.com'>http://theexposureapp.com</a>.";
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
      alert("Couldn't call share function: " + e);
      $scope.go_dashboard();
    }
  };


  $scope.share_with_contacts = function() {
    try {
      $cordovaContacts.pickContact().then(function (contactPicked) {
        console.log("Got this contact: ", contactPicked);
        $scope.contact = contactPicked;
        var email, name, number;

        if (contactPicked.emails && contactPicked.emails[0]) email = contactPicked.emails[0].value;
        if (contactPicked.phoneNumbers && contactPicked.phoneNumbers[0]) number = contactPicked.phoneNumbers[0].value;
        name = contactPicked.displayName || contactPicked.name.formatted;

        /* How to compose an email... */
        var send_email = function(email_address) {
          var email_opts = {
            to: [name + " <" + email_address + ">"],
            subject: "Check out this app for helping oil spill victims...",
            body: $scope.share_body,
            isHtml: true
          };

          $cordovaEmailComposer.open(email_opts).then(function() {
            $scope.go_dashboard(true);
          });
        };

        /* How to compose a text message... */
        var send_sms = function(phone_number) {
          var sms_opts = {
              replaceLineBreaks: true,
              android: { intent: 'INTENT' }
          };
          var body = $scope.share_body.replace("</p><p>", "\n\n").replace("<p>", "").replace("</p>", "");
          body = body.replace(/<a\b[^>]*>/i,"").replace(/<\/a>/i, "");
          $cordovaSms.send(phone_number, body, sms_opts).then(function() {
            $scope.go_dashboard(true);
          });
        };

        /* Okay, let's ask them how they want to share, based on the available items. */
        var buttons = [];
        var clicked = function(index, button) {
          if (button.tag == "email") {
            send_email(button.email);
          } else if (button.tag == "text") {
            send_sms(button.number);
            console.log("Send them a text");
          }
        };

        if (email) {
          for (var i = 0; i < contactPicked.emails.length; i++) {
            var addr = contactPicked.emails[i].value;
            buttons.push({ text: 'Email: ' + addr, tag: "email", email: addr });
          }
        }

        if (number) {
          for (var i = 0; i < contactPicked.phoneNumbers.length; i++) {
            var num = contactPicked.phoneNumbers[i].value;
            buttons.push({ text: 'SMS: ' + num, tag: "text", number: num  });
          }
        }

        var drawer = { buttons: buttons, cancelText: 'Cancel', cancel: function() { return true; }, buttonClicked: clicked };

        if (buttons.length > 0) {
          $ionicActionSheet.show(drawer);
        } else {
          alert("It looks like that contact doesn't have an email or phone number.");
        }
      });
    } catch (e) {
      console.log("Must be in a browser.");
      alert("A problem was encountered: " + e);
      $scope.go_dashboard(true);
    }
  };

  $scope.email_the_exposure = function() {
    var opts = {
        to: ["The Exposure <info@theexposureapp.com>"],
        subject: "Email from a user of The Exposure App",
        body: "I wanted to tell you about something in the app:",
      isHtml: true
    }
    try {
      $cordovaEmailComposer.open(opts).then(function() {
        $scope.go_dashboard("thanks-for-sending-us-email-message");
      });
    } catch(e) {
      console.log(e);
      alert("A problem was encountered: " + e);
      $scope.go_dashboard();
    }
  };
});
