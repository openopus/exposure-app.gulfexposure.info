App.config(function($cordovaAppRateProvider) {
  document.addEventListener("deviceready", function () {
    var prefs = {
      promptAgainForEachNewVersion: true,
      openStoreInApp: false,
      storeAppURL: { ios: "1149126656", android: "market://details?id=com.opuslogica.theexposure.app" }
   };

    // $cordovaAppRateProvider.setPreferences(prefs);
  }, false);
});

