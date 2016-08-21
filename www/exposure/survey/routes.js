App.config(function($stateProvider) {
  $stateProvider
  .state('survey', {
    cache: false,
    url: '/survey',
    params: { codename: null },
    templateUrl: 'exposure/survey/index.html',
    controller: 'SurveyController'
  });
});
