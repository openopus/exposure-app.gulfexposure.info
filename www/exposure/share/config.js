App.config(function($cordovaAppRateProvider) {
  document.addEventListener("deviceready", function () {
    var prefs = {
      language: 'en',
      appName: 'TheExposure',
      iosURL: 'ksjdfkjsdlfjlksjdfk',
     androidURL: 'market://details?id=com.opuslogica.theexposure.app',
   };

   $cordovaAppRateProvider.setPreferences(prefs)
  }, false);
});
