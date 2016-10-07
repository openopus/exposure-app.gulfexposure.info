App.config(function($cordovaAppRateProvider) {
  document.addEventListener("deviceready", function () {
    var prefs = {
      language: 'en',
      appName: 'TheExposure',
      iosURL: 'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=1149126656&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8',
     androidURL: 'market://details?id=com.opuslogica.theexposure.app',
   };

   $cordovaAppRateProvider.setPreferences(prefs)
  }, false);
});
