/* In a separate file for ease of use. */
Factories.factory("$push", function($rootScope, $api, $state, $cordovaPushV5, $cordovaMedia, $cordovaDialogs, $ionicPlatform) {
  var service = { debug: false, settings: null };

  function debug_log() {
    if (service.debug)
      console.log.call(arguments);
  };

  service.initialize = function(settings) {
    if (!settings) {
      settings = { badge: true, sound: true, alert: true, gcm_sender_id: "470283661561" };
    }
    service.settings = settings;
    $cordovaPushV5.initialize(service.settings).then(function() {
      $cordovaPushV5.onNotification();
      $cordovaPushV5.onError();
    });
  };

  service.register = function() {
    $cordovaPushV5.register().then(function(token) {
      var os = ionic.Platform.isIOS() ? "ios" : ionic.Platform.isAndroid() ? "android" : "web";
      var ua = ionic.Platform.ua;
      var device_options = { user_guid: window.oli_device_id, os: os, token: token, ua: ua };
      debug_log("Device Token: " + token);
      $api.create("device", device_options);
    }).catch(function(err) {
               alert("Registration Error: " + JSON.stringify(err));
             });
  };

  service.default_message_handler = function(message) {
    $cordovaDialogs.alert(message);
  };

  service.default_confirm_handler = function(message) {
    return $cordovaDialogs.confirm(message);
  };

  /* The default notification handler.  You can replace this in your own code if you want.
     This one handles sound, messaging alert, and changing the route. */
  service.default_notification_handler = function(notification) {
    var notification_data = notification.additionalData;
    var foreground = false;
    if (notification_data) foreground = notification_data.foreground;

    if (notification.sound) {
      //var snd = $cordovaMedia.newMedia(notification.sound);
      // snd.play();
      if (window.navigator && window.navigator.notification && window.navigator.notification.beep)
        window.navigator.notification.beep();
    }

    if (!foreground && (notification.count || notification.badge)) {
      var number = notification.count || notification.badge;
      $cordovaPushV5.setBadgeNumber(number).then(function(result) {
        debug_log("Set the badge to " + number);
      }, function(err) {
           debug_log("Failed to set the badge!", notification, err);
         });
    }

    if (foreground && notification.message) {
      if (notification_data.confirm) {
        service.default_confirm_handler(notification.message).then(function(button_index) {
          if (button_index == 1) {
            if (notification_data.confirm_route) {
              $state.go(notification_data.confirm_route);
            }
          }
        });
      } else {
        service.default_message_handler(notification.message);
      }
    }


    /* I don't believe this is necessary - we aready set the badge to zero on entry to the app. */
    // if (foreground) $cordovaPushV5.setBadgeNumber(0);

    if (notification_data && notification_data.route) {
      $state.go(notification_data.route);
    }
  };

  $rootScope.$on("$cordovaPushV5:notificationReceived", function(event, notification) {
    debug_log("GOT A PUSH NOTIFICATION!", notification);
    service.default_notification_handler(notification);
  });

  $rootScope.$on('$cordovaPushV5:errorOccurred', function(event, error) {
    debug_log("$push got an error: ", event, error);
  });

  service.ask_for_permission = function(message, counter_tag, times_between_asking) {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.diagnostic &&
        window.cordova.plugins.diagnostic.isRegisteredForRemoteNotifications) {
      var diag = window.cordova.plugins.diagnostic;
      /* Hmmm: diag.isRemoteNotificationsEnabled */
      diag.isRegisteredForRemoteNotifications(function(registered) {
        debug_log("isRegisteredForRemoteNotifications? " + registered);
        if (registered) {
          /* We already have asked and gotten a "Yes"! */
          return;
        } else {
          /* Don't have permission yet.  If we aren't in the middle of asking them again, we can
             ask with our nice message first. */
          if (!counter_tag) counter_tag = message.replace(/[- ]/g, "").toLowerCase();
          if (!times_between_asking) times_between_asking = 3;
          var times_asked = localStorage.getItem(counter_tag) || times_between_asking;
          times_asked = parseInt(times_asked);
          if (times_asked >= times_between_asking) {
            localStorage.removeItem(counter_tag);
            $cordovaDialogs.confirm(message, "Get Notified", ["Not Now", "Sure"]).then(function(bindex) {
              if (bindex == 2) {
                service.register();
              } else {
                localStorage.setItem(counter_tag, "1");
              }
            });
          } else {
            times_asked += 1;
            localStorage.setItem(counter_tag, times_asked);
          }
        }
      });
    }
  };

  $ionicPlatform.ready(function() {
    /* When loaded - flush the current badge number. */
    $cordovaPushV5.setBadgeNumber(0);
    service.initialize();
  });

  return service;
});
