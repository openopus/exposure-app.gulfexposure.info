Factories.factory("$api", function($http, $q) {
  var service = {};
  var baseURL = "http://api.gulfexposure.info/api";

  service.get = function(thing) {
    return $http.get(baseURL + "/" + thing);
  };

  return service;
});
