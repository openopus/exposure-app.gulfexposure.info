App.config(function($stateProvider) {
  $stateProvider
  .state('dashboard', {
    /* How to cache the controller, but still execute some code every time the associated view appears. */
    cache: true,
    onEnter: function($rootScope, $stateParams) { $rootScope.$broadcast("dashboard.i-fucking-hate-ionic-controller-caching", $stateParams); },
    params: { show_message: null },
    url: '/dashboard',
    templateUrl: 'exposure/dashboard/index.html',
    controller: 'DashboardController'
  });
});
