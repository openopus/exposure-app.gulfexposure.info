// routes.js: -*- JavaScript-IDE -*-  DESCRIPTIVE TEXT.
//
// Copyright (c) 2016 Brian J. Fox
// Author: Brian J. Fox (bfox@opuslogica.com) Fri Aug 19 07:53:51 2016.
App.config(function($urlRouterProvider) {
  $urlRouterProvider.otherwise(function($injector, $location) {
    console.log("EXECUTING THIS CODE");
    var key = 'exposure-first-run';
    var first_run = localStorage.getItem(key);
    if (first_run == 'yes') {
      return '/dashboard';
    } else {
      localStorage.setItem(key, 'yes');
      return '/intro';
    }
  });
});
