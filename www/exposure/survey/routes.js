App.config(function($stateProvider) {
  $stateProvider
  .state('survey', {
    cache: false,
    resolve: {
      groups: function($q, Survey) {
        var defer = $q.defer();
        Survey.initialized.then(function() {
          defer.resolve(Survey.groups);
        });
        return defer.promise;
      }
    },
    url: '/survey/:codename',
    templateUrl: 'exposure/survey/index.html',
    controller: 'SurveyController'
  });
});
