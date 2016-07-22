var App = angular.module('Exposure', ['ionic', 'exposure.controllers', 'exposure.factories']);

App.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

App.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    'templateUrl': 'templates/exposure/index.html',
    'controller': 'AppController'
  })

  .state('app.home', {
    url: '/home',
    templateUrl: 'templates/exposure/home.html',
    controller: 'HomeController'
  })

  .state('app.map', {
    url: '/map',
    templateUrl: 'templates/exposure/map.html',
    controller: 'MapController'
  })

  .state('app.blog', {
    url: '/blog',
    templateUrl: 'templates/exposure/blog.html',
    controller: 'BlogController'
  })

  .state('app.blog_detail', {
    url: '/blog/:id',
    templateUrl: 'templates/exposure/blog_detail.html',
    controller: 'BlogDetailController'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
