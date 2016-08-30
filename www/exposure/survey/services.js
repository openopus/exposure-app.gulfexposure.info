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
    for (var i = 0; i < service.surveys.length; i++) {
      if (service.surveys[i].codename == codename) {
        service.surveys.splice(i, 1);
        break;
      }
    }
  };

  service.destroy = function(survey) {
    var defer = $q.defer();
    var result = defer.promise;
    try {
      service.remove_survey_by_codename(survey.codename);
      $api.delete("survey_remove/" + survey.codename).then(function(response) {
        defer.resolve(response.data);
      });
    } catch(e) {
      console.log("ERROR DELETING SURVEY DATA: ", e);
      defer.resolve(e);
    }

    return result;
  };

  service.get_survey_by_codename = function(codename, force) {
    var defer = $q.defer();
    var result = defer.promise;
    var survey = null;
    var i;

    /* See if there's a survey here. */
    for (i = 0; i < service.surveys.length; i++) {
      if (service.surveys[i].codename == codename) {
        survey = service.surveys[i];
        break;
      }
    }

    /* Get rid of the one that's there if we are forcing a refresh. */
    if (survey && force) {
      service.surveys.splice(i, 1);
      survey = null;
    }

    if (survey) {
      service.set_status(survey);
      defer.resolve(survey);
    } else {
      survey = { codename: codename, user: null, answers: [] };
      var answers_promise = service.answers_for(codename);
      var user_promise = ExposureUser.get_by_codename(codename);

      $q.all([answers_promise, user_promise, service.initialized]).then(function(values) {
        survey.groups = JSON.parse(JSON.stringify(service.groups));
        survey.answers = values[0];
        survey.user = values[1];
        service.zipper(survey);
        service.set_status(survey);
        service.surveys.push(survey);
        defer.resolve(survey)
      });
    }
    return result;
  };

  /* Can only be called on a survey that's been zippered. */
  service.set_status = function(survey) {
    if (!survey) {
      console.log("Shouldn't happen, ever");
      return;
    }

    var all_answered = false;
    survey.num_answered = survey.answers.length;
    survey.num_questions = service.num_questions;
    
    if (survey.num_answered != survey.num_questions) {
      var questions = service.get_questions(survey);
      var answered = 0;
      questions.forEach(function(q) {
        // console.log("SET-STATUS - " + q.tag + ": " + q.answer);

        if (q.dependent_on) {
          var dans = service.get_question_by_tag(q.dependent_on, questions);
          if (!dans) {
            answered++;
          } else {
            // console.log("dans.answer, q.dependent_answer", dans.answer, q.dependent_answer);
            if (dans.answer == q.dependent_answer) {
              answered++;
            }
          }
        } else {
          if (q.answer) answered++;
        }
      });

      if (answered >= survey.num_questions) {
        all_answered = true;
      }
    } else {
      all_answered = true;
    }
    // console.log(info.codename + ":" + info.num_answered + " out of " + info.num_questions);
    survey.complete = all_answered;
    survey.status = survey.complete ? "complete" : "incomplete";
  };

  service.new_survey = function() {
    var defer = $q.defer();
    var result = defer.promise;
    var survey = { answers: [] };
    var codename_promise = ExposureCodename.make_new();

    $q.all([codename_promise, service.initialized]).then(function(values) {
      survey.codename = values[0];
      ExposureUser.get_by_codename(survey.codename).then(function(user) {
        survey.user = user;
        survey.groups = JSON.parse(JSON.stringify(service.groups));
        service.zipper(survey);
        service.set_status(survey);
        service.surveys.push(survey);
        defer.resolve(survey);
      });
    });

    return result;
  };

  service.codename_of = function(survey) {
    return survey.user.codename;
  };

  service.get_question_by_id = function(question_id, survey) {
    var question = null;

    if (survey.groups) {
      for (var i = survey.groups.length - 1; i >= 0 && !question; i--) {
        var questions = survey.groups[i].questions;

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

  service.get_question_by_tag = function(tag, survey) {
    var question = null;

    if (survey.groups) {
      for (var i = survey.groups.length - 1; i >= 0 && !question; i--) {
        var questions = survey.groups[i].questions;

        for (var j = questions.length - 1; j >= 0; j--) {
          if (questions[j].tag == tag) {
            question = questions[j];
            break;
          }
        }
      }
    }

    return question;
  };

  service.get_value_by_tag = function(tag, survey) {
    var question = service.get_question_by_tag(tag, survey);
    return question ? question.answer : null;
  };

  service.get_questions = function(survey) {
    var questions = [];
    for (var i = 0; i < survey.groups.length; i++) {
      for (var j = 0; j < survey.groups[i].questions.length; j++) {
        questions.push(survey.groups[i].questions[j]);
      }
    }

    return questions;
  };

  service.get_questions_by_seltype = function(wanted, survey) {
    var result = [];
    var questions = service.get_questions(survey);

    questions.forEach(function(question) {
      if (question.seltype == wanted)
        result.push(question);
    });

    return result;
  };

  /* Zipper the answers into the questions. */
  service.zipper = function(survey) {
    var questions = service.get_questions(survey);
    var answer_for_question = function(question) {
      var result = undefined;
      survey.answers.forEach(function(a) {
        if ((a.survey_question_id == question.id) || (a.question_id == question.id))
          result = a;
      });

      return result;
    };

    questions.forEach(function(question) {
      var value = undefined;
      var answer = answer_for_question(question);
      var value = answer ? answer.value : null;

      // console.log("ZIPPER - " + question.tag + ": " + value);

      /* Zero out the answer locations. */
      delete question.other_checked;
      question.options.forEach(function(option) { option.checked = false; });
      question.answer = value;

      /* Complicated? Yes: But also correct. */
      if (question.seltype == "boolean") {
        question.checked = (value == 'Yes');
        question.answer = value ? value : "No";
        value = question.answer;
      }

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
      }

      question.answer = value;
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
