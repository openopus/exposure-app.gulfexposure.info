App.config(function($stateProvider) {
  $stateProvider
  .state('survey', {
    url: '/survey',
    templateUrl: 'exposure/survey/index.html',
    controller: 'SurveyController'
  });
});
