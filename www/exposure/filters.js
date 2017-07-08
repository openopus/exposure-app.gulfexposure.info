//filters.js: -*- JavaScript-IDE -*-  DESCRIPTIVE TEXT.
//
// Copyright (c) 2016 Brian J. Fox
// Author: Brian J. Fox (bfox@opuslogica.com) Mon Aug 22 03:49:36 2016.
App.filter('asAge', function() {
  return function(input) {
    var output = '??';
    var birthdate = input;

    if (birthdate) {
      if (typeof birthdate == "string") { birthdate = new Date(input); }
      var ms_diff = Date.now() - birthdate.getTime();
      if (isNaN(ms_diff)) {
        output = input.replace(" years", "");
      } else {
        var age = new Date(ms_diff);
        output = "" +  (Math.abs(age.getUTCFullYear() - 1970));
      }
    }

    return output;
  };
});

App.filter('double_digits', function() {
  return function(input) {
    var num = input ? parseInt(input) : 0;
    var output = String(num);

    while (output.length < 2) { output = "0" + output;}

    return output;
  };
});
