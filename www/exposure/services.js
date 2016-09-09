Factories.factory("$app", function($rootScope) {
  var service = { network: null, online: null };

  document.addEventListener("online", function(network_type) {
    service.network = network_type.type;
    service.online = true;
    $rootScope.$broadcast("$app:network-online");
  });

  document.addEventListener("offline", function(network_type) {
    service.network = network_type.type;
    service.online = false;
    $rootScope.$broadcast("$app:network-offline");
  });

  return service;
});

Factories.factory("$api", function($http, $q) {
  var service = {};
  var baseURL = "https://api.gulfexposure.info/api";
  baseURL = "http://localhost:3000/api";

  if (window.cordova && (baseURL == "http://localhost:3000/api")) {
    baseURL = "https://api.gulfexposure.info/api";
  };

  service.get = function(thing) {
    return $http.get(baseURL + "/" + thing, service.extra_headers()).then(function(response) {
             return response;
           }, function(error_response) {
                console.log("ERROR: ", error_response);
                return $q.reject(error_response);
              });
  };

  service.getx    = function(thing) { return $http.get(baseURL + "/" + thing, service.extra_headers()); };
  service.create = function(thing, data) { return $http.post(baseURL + "/" + thing, data, service.extra_headers()); };
  service.post   = function(thing, data) { return $http.post(baseURL + "/" + thing, data, service.extra_headers()); };
  service.update = function(thing, data) { return $http.put(baseURL + "/" + thing, data, service.extra_headers()); };
  service.delete = function(thing) { return $http.delete(baseURL + "/" + thing, service.extra_headers()); };

  service.extra_headers = function() {
    return {
      headers: { "OLI-Device-ID" : window.oli_device_id }
    };
  };

  return service;
});

Factories.factory("ExposureCodename", function($q, $api, $localStorage) {
  var service = { codename: null };

  service.get_all = function() {
    if (!service.codenames) { service.codenames = $localStorage.codenames || []; }
  };

  service.forget = function(codename) {
    for (var i = service.codenames.length - 1; i >= 0; i--) {
      if (service.codenames[i] == codename) {
        service.codenames.splice(i, 1);
        break;
      }
    }
  };

  service.set_current = function(codename) {
    if (codename == service.codename) return;
    if (!service.codenames) service.get_all();
    if (!service.codenames) service.codenames = [];

    service.forget(codename);
    service.codenames.unshift(codename);
    $localStorage.codenames = service.codenames;
    $localStorage.codename_index = 0;
    service.codename = codename;
  };

  service.regen = function(codename) {
    service.forget(codename);
    return $api.get("codename/regen/" + codename);
  };

  service.get = function(make_new_p) {
    var defer  = $q.defer();
    var result = defer.promise;

    if (!service.codenames) service.codenames = $localStorage.codenames || [];

    if (!make_new_p) {
      if (!service.codename) {
        service.codename = service.codenames[$localStorage.codename_index];
      }

      if (service.codename) {
        defer.resolve(service.codename);
      } else {
        make_new_p = true;
      }
    }

    if (make_new_p) {
      var device_info = ionic.Platform.device();
      var os = ionic.Platform.isIOS() ? "ios" : ionic.Platform.isAndroid() ? "android" : "web";
      var token = device_info.uuid;
      var ua = ionic.Platform.ua;
      var user_options = { guid: window.oli_device_id };
      var device_options = { user_guid: window.oli_device_id, os: os, token: token, ua: ua };

      var promises = [$api.create("user", user_options), $api.create("device", device_options)];

      $q.all(promises).then(function(values) {
        var user_response = values[0], device_response = values[1];
        service.set_current(user_response.data.codename);
        defer.resolve(service.codename);
      });
    }

    return result;
  };


  service.make_new = function() {
    return service.get(true);
  };

  return service;
});

Factories.factory("ExposureUser", function($q, $api, $localStorage) {
  var service = { users: null };

  service.get_by_id = function(id) {
    var defer = $q.defer();
    var result = defer.promise;
    var user = null;
    
    if (service.users) {
      for (var i = 0; i < service.users.length; i++) {
        if (service.users[i].id == id) {
          user = service.users[i];
          defer.resolve(user);
          break;
        }
      }
    }

    if (!user) {
      // defer.reject("No such user");
      defer.resolve(null);
    }

    return result;
  };

  service.get_by_codename = function(codename) {
    var defer = $q.defer();
    var result = defer.promise;
    var user = null;
    
    if (service.users) {
      for (var i = 0; i < service.users.length; i++) {
        if (service.users[i].codename == codename) {
          user = service.users[i];
          defer.resolve(user);
          break;
        }
      }
    }

    if (!user) {
      $api.get("users?codename=" + codename).then(function(response) {
        var users = response.data;
        if (users && users.length > 0) user = users[0];
        
        if (user) {
          users = $localStorage.users || [];
          users.push(user);
          $localStorage.users = users;
          defer.resolve(user);
        } else {
          // defer.reject("No such user");
          defer.resolve(null);
        }
      });
    }

    return result;
  }

  return service;
});

Factories.factory("$push", function($rootScope, $api, $state, $cordovaPushV5, $cordovaMedia, $cordovaDialogs, $ionicPlatform) {
  var service = { settings: null };

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
      console.log("Device Token: " + token);
      $api.create("device", device_options);
    }).catch(function(err) {
               alert("Registration Error: " + JSON.stringify(err));
             });
  };

  $rootScope.$on("$cordovaPushV5:notificationReceived", function(event, notification) {
    console.log("GOT A PUSH NOTIFICATION!", notification);
    var notification_data = notification.additionalData;
    var foreground = false;
    if (notification_data) foreground = notification_data.foreground;

    if (notification.sound) {
      var snd = $cordovaMedia.newMedia(notification.sound);
      snd.play();
    }

    if (!foreground && notification.badge) {
      $cordovaPushV5.setBadgeNumber(notification.badge).then(function(result) {
        console.log("Set the badge to " + notification.badge);
      }, function(err) {
        console.log("Failed to set the badge!", notification, err);
         });
    } else {
      $cordovaPushV5.setBadgeNumber(0);
    }

    if (notification_data && notification_data.route) {
      $state.go(notification_data.route);
    }
  });

  $rootScope.$on('$cordovaPushV5:errorOccurred', function(event, error) {
    console.log("$push got an error: ", event, error);
  });

  service.ask_for_permission = function(message, counter_tag, times_between_asking) {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.diagnostic &&
        window.cordova.plugins.diagnostic.isRegisteredForRemoteNotifications) {
      var diag = window.cordova.plugins.diagnostic;
      /* Hmmm: diag.isRemoteNotificationsEnabled */
      diag.isRegisteredForRemoteNotifications(function(registered) {
        console.log("isRegisteredForRemoteNotifications? " + registered);
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
