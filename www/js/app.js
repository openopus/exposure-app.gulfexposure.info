var App = angular.module('Exposure', ['ionic', 'exposure.controllers', 'exposure.factories', 'ngMaps', 'ngStorage',
                                      'oli.wordpress_services', 'contenteditable']);

App.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) { StatusBar.styleDefault(); }
  });
});

App.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('intro', {
    url: '/intro',
    templateUrl: 'exposure/intro/index-without-header.html',
    controller: 'IntroController'
  })

  .state('story', {
    url: '/story',
    templateUrl: 'exposure/intro/index-with-header.html',
    controller: 'IntroController'
  })

  .state('story.page1', {
    url: '/page1',
    templateUrl: 'exposure/intro/home2.html',
    controller: 'IntroController'
  })

  .state('app', {
    url: '/app',
    'templateUrl': 'exposure/index.html',
    'controller': 'ExposureController'
  })

  .state('app.dashboard', {
    url: '/dashboard',
    templateUrl: 'exposure/dashboard/index.html',
    controller: 'DashboardController'
  })

  .state('app.survey', {
    url: '/survey',
    templateUrl: 'exposure/survey/index.html',
    controller: 'SurveyController'
  })

  .state('app.map', {
    url: '/map',
    templateUrl: 'exposure/map/index.html',
    controller: 'MapController'
  })

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

  $urlRouterProvider.otherwise('/intro');
});
