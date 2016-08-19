/* The global App variable is the base module.  As other dependencies are introduced,
   they self-inject themselves into the App.  The basic routes are also stored in each
   section of the app, in this case, in various exposure/<section>/routes.js files. */
var App = angular.module('Exposure', ['ionic', 'ngMaps', 'ngStorage', 'oli.transitions']);

App.run(function($ionicPlatform, $ionicConfig) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins) {
      if (window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.plugins.nativepagetransitions) {
        $ionicConfig.views.transition('none');
      }
    }
    if (window.StatusBar) { StatusBar.styleBlackTranslucent(); }
  });
});

