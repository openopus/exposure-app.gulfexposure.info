App.config(function($stateProvider) {
  $stateProvider
  .state('map', {
    url: '/map',
    templateUrl: 'exposure/map/index.html',
    controller: 'MapController'
  });
});
