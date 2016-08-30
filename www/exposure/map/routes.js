App.config(function($stateProvider) {
  $stateProvider
  .state('map', {
    cache: false,
    url: '/map',
    templateUrl: 'exposure/map/index.html',
    controller: 'MapController'
  });
});
