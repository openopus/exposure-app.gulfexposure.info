//codenames.js: -*- JavaScript-IDE -*-  DESCRIPTIVE TEXT.
//
// Copyright (c) 2016 Brian J. Fox
// Author: Brian J. Fox (bfox@opuslogica.com) Wed Aug 10 21:32:39 2016.
Factories.factory("$codename", function($http, $q, $api, $localStorage) {
  var service = {};
  var codename = $localStorage.codename;

  service.get = function(name) {
    if (typeof codename === "undefined") {
      return $api.get("codename");
    } else {
      return codename;
    };
  };

  return service;
});
