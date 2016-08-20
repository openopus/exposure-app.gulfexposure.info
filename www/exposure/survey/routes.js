App.config(function($stateProvider) {
  $stateProvider
  .state('survey', {
    url: '/survey',
    params: { codenmae: null },
    templateUrl: 'exposure/survey/index.html',
    controller: 'SurveyController'
  });
});
