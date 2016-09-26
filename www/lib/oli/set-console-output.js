var theRealConsole = console;
var setConsoleOutput = function(on) {
  if (!on) {
    theRealConsole = console;
    console = {};
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
  } else {
    console = theRealConsole;
  }
  window.console = console;
}
setConsoleOutput(true);

