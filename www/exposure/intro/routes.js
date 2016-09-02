App.config(function($stateProvider) {
  $stateProvider

  .state('intro', {
    url: '/intro',
    templateUrl: 'exposure/intro/intro.html',
    controller: 'IntroController'
  })

  .state('why', {
    url: '/why',
    templateUrl: 'exposure/intro/why.html',
    controller: 'IntroController'
  })
});
