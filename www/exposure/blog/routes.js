// routes.js: -*- JavaScript-IDE -*-  DESCRIPTIVE TEXT.
//
// Copyright (c) 2016 Brian J. Fox
// Author: Brian J. Fox (bfox@opuslogica.com) Tue Aug 16 18:45:58 2016.
App.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app.blog', {
    url: '/blog',
    templateUrl: 'exposure/blog/list.html',
    controller: 'BlogController'
  })

  .state('app.blog_detail', {
    url: '/blog/:id',
    templateUrl: 'exposure/blog/detail.html',
    controller: 'BlogDetailController'
  })

  .state('app.blog_create', {
    url: '/blog_create',
    templateUrl: 'exposure/blog/create.html',
    controller: 'BlogCreateController'
  })

  .state('app.blog_thanks', {
    url: '/blog_thanks',
    templateUrl: 'exposure/blog/thanks.html',
    controller: 'BlogCreateController'
  })
});
