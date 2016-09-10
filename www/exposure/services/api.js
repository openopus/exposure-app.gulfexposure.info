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
