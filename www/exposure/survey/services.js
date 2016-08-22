/* Survey Services: -*- JavaScript-IDE -*-  Services for getting and managing survey questions.

   Copyright (c) 2016 Brian J. Fox
   Author: Brian J. Fox (bfox@opuslogica.com) Tue Aug 16 16:59:23 2016. */
Services.factory('Survey', function($api, $q, ExposureCodename, ExposureUser) {
  var service = { groups: null, num_questions: 0, surveys: [] };

  service.initialize = function() {
    var defer = $q.defer();
    service.initialized = defer.promise;
    service.num_questions = 0;

    $api.get("survey_template").then(function(response) {
      service.groups = response.data;

      service.groups.forEach(function(group) {
        service.num_questions += group.questions.length;
      });

      defer.resolve(true);
    });
  };

  service.get_survey_template = function() {
    var defer = $q.defer();
    var result = defer.promise;

    service.initialized.then(function() {
      defer.resolve(service.groups);
    });

    return result;
  };

  service.remove_survey_by_codename = function(codename, force) {
    /* See if there's a survey here. */
    for (i = 0; i < service.surveys.length; i++) {
      if (service.surveys[i].codename == codename) {
        service.surveys.splice(i, 1);
        break;
      }
    }
  };

  service.get_survey_by_codename = function(codename, force) {
    var defer = $q.defer();
    var result = defer.promise;
    var info = null;
    var i;

    /* See if there's a survey here. */
    for (i = 0; i < service.surveys.length; i++) {
      if (service.surveys[i].codename == codename) {
        info = service.surveys[i];
        break;
      }
    }

    /* Get rid of the one that's there if we are forcing a refresh. */
    if (info && force) {
      service.surveys.splice(i, 1);
      info = null;
    }

    if (info) {
      defer.resolve(info);
    } else {
      info = { codename: codename, user: null, answers: [] };
      var answers = service.answers_for(codename);
      var user = ExposureUser.get_by_codename(codename);

      $q.all([answers, user, service.initialized]).then(function(values) {
        info.answers = values[0];
        info.user = values[1];
        info.num_answered = info.answers.length;
        info.num_questions = service.num_questions;
        info.complete = info.num_answered >= info.num_questions;
        info.status = info.complete ? "complete" : "incomplete";
        service.surveys.push(info);
        defer.resolve(info)
      });
    }
    return result;
  };

  service.compute_metadata = function(survey) {
    survey.num_answered = survey.answers.length;
    survey.num_questions = service.num_questions;
    survey.complete = survey.num_answered >= survey.num_questions;
    survey.status = survey.complete ? "complete" : "incomplete";
  }

  service.new_survey = function() {
    var defer = $q.defer();
    var result = defer.promise;
    var info = { answers: [] };
    var codename_promise = ExposureCodename.make_new();

    codename_promise.then(function(codename) {
      info.codename = codename;
      ExposureUser.get_by_codename(codename).then(function(user) {
        info.user = user;
        service.surveys.push(info);
        defer.resolve(info);
      });
    });

    return result;
  };

  service.get_question_by_id = function(question_id) {
    var question = null;

    if (service.groups) {
      for (var i = service.groups.length - 1; i >= 0 && !question; i--) {
        var questions = service.groups[i].questions;

        for (var j = questions.length - 1; j >= 0; j--) {
          if (questions[j].id == question_id) {
            question = questions[j];
            break;
          }
        }
      }
    }

    return question;
  };

  service.get_question_by_name = function(name) {
    var questions = service.get_questions(service.groups);
    var result = null;

    for (var i = questions.length - 1; i >= 0; i--) {
      if (questions[i].name == name) {
        result = questions[i];
        break;
      }
    }

    return result;
  };

  service.get_answer_by_question_id = function(question_id, answers) {
    var answer = null;

    if (answers) {
      for (var i = answers.length - 1; i >= 0; i--) {
        if (answers[i].survey_question_id == question_id) {
          answer = answers[i];
          break;
        }
      }
    }
    return answer;
  };

  service.get_answer_by_name = function(name, info) {
    var question, answer;

    try {
      question = service.get_question_by_name(name);
      answer = service.get_answer_by_question_id(question.id, info.answers);
    } catch(e) {
      console.log("FAILED: Survey.get_answer_by_name(" + name + ", ...");
    }

    return answer;
  }

  service.get_questions = function(from_groups) {
    var questions = [];
    if (!from_groups) from_groups = service.groups;
    if (from_groups) {
      for (var i = from_groups.length - 1; i >= 0; i--) {
        for (var j = from_groups[i].questions.length - 1; j >= 0; j--) {
          questions.push(from_groups[i].questions[j]);
        }
      }
    }

    return questions;
  };

  service.get_questions_by_seltype = function(wanted, from_groups) {
    var result = [];
    var questions = service.get_questions(from_groups);

    questions.forEach(function(question) {
      if (question.seltype == wanted)
        result.push(question);
    });

    return result;
  };

  service.set_question_answer = function(answer) {
    var question = service.get_question_by_id(answer.survey_question_id);
    if (question) question.answer = answer.value;
  };
        
    
  /* Zipper the answers into the questions. */
  service.zipper = function(groups, answers) {
    var questions = service.get_questions(groups);

    questions.forEach(function(question) {
      var value = undefined;
      var answer = service.get_answer_by_question_id(question.id, answers);

      /* Zero out the answer locations. */
      delete question.other_checked;
      question.options.forEach(function(option) { option.checked = false; });
      question.answer = undefined;

      if (answer) {
        value = answer.value;

        if (value) {

          if (question.seltype == "date") {
            if (typeof value == "string")
              value = new Date(value);
          }

          if (typeof value == "string" && question.seltype.startsWith("pick")) {
            var value_options = value.replace(/^[,\s]+|[\s,]+$/gm, "").replace(/, /g, ",").split(",");

            for (var i = 0; i < question.options.length; i++) {
              var option = question.options[i];
              var offset = value_options.indexOf(option.name);

              if (offset > -1) {
                option.checked = true;
                value_options[offset] = undefined;
              }
            }

            var temp = [];
            for (var j = 0; j < value_options.length; j++) {
              if (typeof value_options[j] != "undefined")
                temp.push(value_options[j]);
            }
            value = temp.join();

            if (value) {
              question.other_checked = true;
            }
          }

          question.answer = value;
        }
      }
    });
  };

  service.answers_for = function(codename) {
    var defer = $q.defer();
    var result = defer.promise;

    $api.get("survey_answers_for/" + codename).then(function(response) {
      var answers = response.data;
      defer.resolve(answers);
    });

    return (result);
  }

  service.initialize();
  return service;
});
