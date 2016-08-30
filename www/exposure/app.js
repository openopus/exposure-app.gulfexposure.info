/* app.js: -*- JavaScript-IDE -*-  Specific start functions for Exposure. */
App.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    var make_uuid = function() {
      var d = new Date().getTime();

      /* Use the high-precision timer if it's available. */
      if (window.performance && typeof window.performance.now === "function") d += performance.now(); 

      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                   var r = (d + Math.random()*16)%16 | 0;
                   d = Math.floor(d/16);
                   return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                 });
      return uuid;
    }

    var device_id = localStorage.getItem('oli-device-id');
    if (!device_id) {
      device_id = make_uuid();
      localStorage.setItem('oli-device-id', device_id);
    }

    window.oli_device_id = device_id;
    // console.log("OLI DEVICE ID: " + window.oli_device_id);
  });
});

