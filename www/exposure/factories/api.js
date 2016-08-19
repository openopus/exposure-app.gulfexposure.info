Factories.factory("$api", function($http, $q) {
  var service = {};
  var baseURL = "http://api.gulfexposure.info/api";
  baseURL = "http://localhost:3000/api";

  service.get = function(thing) {
    return $http.get(baseURL + "/" + thing);
  };

  service.create = function(thing, data) {
  };

  service.update = function(thing, data) {
  };

  service.add = function(thing, data) {
  };

  return service;
});
