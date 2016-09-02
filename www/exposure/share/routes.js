App.config(function($stateProvider) {
  $stateProvider
  .state('share', {
    /* How to cache the controller, but still execute some code every time the associated view appears. */
    onEnter: function($rootScope, $stateParams) { $rootScope.$broadcast("share-app-controller-entered", $stateParams); },
    url: '/share',
    templateUrl: 'exposure/share/index.html',
    controller: 'ShareAppController'
  });
});
