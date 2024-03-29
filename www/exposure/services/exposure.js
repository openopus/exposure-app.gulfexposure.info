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

