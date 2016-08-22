Factories.factory("$api", function($http, $q) {
  var service = {};
  var baseURL = "https://api.gulfexposure.info/api";
  // baseURL = "http://localhost:3000/api";

  service.get = function(thing) { return $http.get(baseURL + "/" + thing); };
  service.create = function(thing, data) { return $http.post(baseURL + "/" + thing, data); };
  service.post   = function(thing, data) { return $http.post(baseURL + "/" + thing, data); };
  service.update = function(thing, data) { return $http.put(baseURL + "/" + thing, data); };
  service.delete = function(thing) { return $http.delete(baseURL + "/" + thing); };

  return service;
});

Factories.factory("ExposureCodename", function($q, $api, $localStorage) {
  var service = { codename: null };

  service.get_all = function() {
    if (!service.codenames) { service.codenames = $localStorage.codenames || []; }
  };

  service.set_current = function(codename) {
    if (codename == service.codename) return;
    if (!service.codenames) service.get_all();
    if (!service.codenames) service.codenames = [];

    for (var i = service.codenames.length - 1; i >= 0; i--) {
      if (service.codenames[i] == codename) {
        service.codenames.splice(i, 1);
        break;
      }
    }

    service.codenames.unshift(codename);
    $localStorage.codenames = service.codenames;
    $localStorage.codename_index = 0;
    service.codename = codename;
  };

  service.get = function(make_new_p) {
    var defer  = $q.defer();
    var result = defer.promise;

    if (!service.codenames) service.codenames = $localStorage.codenames || [];

    if (make_new_p) {
      $api.create("user").then(function(response) {
        service.set_current(response.data.codename);
        defer.resolve(service.codename);
      });
    } else {
      if (!service.codename) {
        service.codename = service.codenames[$localStorage.codename_index];
      }

      if (service.codename) {
        defer.resolve(service.codename);
      } else {
        $api.create("user").then(function(response) {
          var user = response.data;
          service.set_current(user.codename);
          defer.resolve(service.codename);
        });
      }
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
      defer.reject("No such user");
    }

    return result;
  }

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
        if (users.length > 0) user = users[0];
        
        if (user) {
          users = $localStorage.users || [];
          users.push(user);
          $localStorage.users = users;
          defer.resolve(user);
        } else {
          defer.reject("No such user");
        }
      });
    }

    return result;
  }

  return service;
});
