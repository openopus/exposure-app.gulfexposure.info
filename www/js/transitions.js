//transitions.js: -*- JavaScript-IDE -*-  DESCRIPTIVE TEXT.
//
// Copyright (c) 2016 Brian J. Fox
// Author: Brian J. Fox (bfox@opuslogica.com) Wed Aug 17 09:53:34 2016.
var Transitions = angular.module('oli.transitions', []);

Transitions.factory('$transitions', function($window, $state) {
  return {
    go: function(new_state, opts) {
      var transition_success = function(msg) { /* console.log("Transitioned: " + msg); */ };
      var transition_failure = function(msg) { console.error("Transition Failed: " + msg); };

      if (typeof opts === "undefined") { opts = { type: "slide", direction: "left" }; }
      try {
        var trans_type = opts["type"] || "slide"
        delete opts["type"];
        $state.go(new_state);

        switch(trans_type) {
          case "slide":
          window.plugins.nativepagetransitions.slide(opts, transition_success, transition_failure);
          break;
          case "fade":
          window.plugins.nativepagetransitions.fade(opts, transition_success, transition_failure);
          break;
          case "flip":
          window.plugins.nativepagetransitions.flip(opts, transition_success, transition_failure);
          break;
          case "curl":
          window.plugins.nativepagetransitions.curl(opts, transition_success, transition_failure);
          break;
        }
      } catch(x) {
        console.log("transitions: It dinna work!", x);
      }
    }
  };
});
