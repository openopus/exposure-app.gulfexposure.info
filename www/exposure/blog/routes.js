// routes.js: -*- JavaScript-IDE -*-  DESCRIPTIVE TEXT.
//
// Copyright (c) 2016 Brian J. Fox
// Author: Brian J. Fox (bfox@opuslogica.com) Tue Aug 16 18:45:58 2016.
App.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('blog', {
    url: '/blog/list',
    templateUrl: 'exposure/blog/list.html',
    controller: 'BlogController'
  })

  .state('blog_detail', {
    url: '/blog/show/:id',
    templateUrl: 'exposure/blog/detail.html',
    controller: 'BlogDetailController'
  })

  .state('blog_create', {
    url: '/blog/create',
    templateUrl: 'exposure/blog/create.html',
    controller: 'BlogCreateController'
  })

  .state('blog_thanks', {
    url: '/blog/thanks',
    templateUrl: 'exposure/blog/thanks.html',
    controller: 'BlogCreateController'
  })
});
