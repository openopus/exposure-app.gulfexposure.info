App.config(function($stateProvider) {
  $stateProvider
  .state('dashboard', {
    /* How to cache the controller, but still execute some code every time the associated view appears. */
    onEnter: function($rootScope) { $rootScope.$broadcast("dashboard.i-fucking-hate-ionic-controller-caching"); },
    url: '/dashboard',
    templateUrl: 'exposure/dashboard/index.html',
    controller: 'DashboardController'
  });
});
