/* Survey Services: -*- JavaScript-IDE -*-  Services for getting and managing survey questions.

   Copyright (c) 2016 Brian J. Fox
   Author: Brian J. Fox (bfox@opuslogica.com) Tue Aug 16 16:59:23 2016. */
Services.factory('Survey', function($api, $q, $localStorage) {
  var service = { initialized: $q.defer(), groups: null, codename: null };
  $api.get("survey_groups").then(function(response) {
    service.groups = response.data;
    service.groups.forEach(function(group) {
      $api.get("survey_questions?survey_group_id=" + group.id).then(function(response) {
        group.questions = response.data;
        group.questions.forEach(function(question) {
          $api.get("question_options?survey_question_id=" + question.id).then(function(response) {
            question.options = response.data;
          });
        });
      });
    });
    service.initialized.resolve(true);
  });

  service.get_survey = function() {
    var defer = $q.defer();
    var result = defer.promise;
    if (service.groups) {
      defer.resolve(service.groups);
    } else {
      console.log("DEFERRING...");
      service.initialized.promise.then(function() {
        console.log("RESOLVED SERVICE GROUPS");
        defer.resolve(service.groups);
      });
    }
    return result;
  };

  return service;
});

