App.config(function($stateProvider) {
  $stateProvider

  .state('intro', {
    url: '/intro',
    templateUrl: 'exposure/intro/first.html',
    controller: 'IntroController'
  })

  .state('story', {
    url: '/story',
    templateUrl: 'exposure/intro/story.html',
    controller: 'IntroController'
  })
});
