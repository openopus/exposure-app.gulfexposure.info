App.config(function($stateProvider) {
  $stateProvider
  .state('dashboard', {
    onEnter: function($rootScope) {
      $rootScope.$broadcast("dashboard.i-fucking-hate-ionic-controller-caching");
      console.log("onEnter: Whoo Hoo");
    },
    url: '/dashboard',
    templateUrl: 'exposure/dashboard/index.html',
    controller: 'DashboardController'
  });
});
