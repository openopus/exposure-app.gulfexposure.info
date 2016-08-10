Controllers.controller('MapController', function($scope, $rootScope, $timeout, $api, $timeout) { 
  $scope.heatmap = { center: null, options: {}, events: {} };
  $scope.heatmap_data = null;

  try {
    $scope.heatmap_data = $api.get("heatmap");
  } catch(x) {
    console.error("Couldn't talk to the API server in map/controllers.js", x);
  }

  $scope.initialize_map = function() {
    var success = function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var ctr  = new google.maps.LatLng(lat, lng);
      var elt = document.getElementById("heatmap");
      $scope.heatmap.options = { zoom: 4, center: ctr };
      debugger;
      $scope.heatmap.map = new google.maps.Map(elt, $scope.heatmap.options);
    };

    var failure = function(why) {
      console.error("Ah, you failed.  Here's why: ", why);
    };

    navigator.geolocation.getCurrentPosition(success, failure, { timeout: 30000 });
  };

  $timeout($scope.initialize_map, 1000);

/*
    $scope.heatmap.then(function(map_data) {
    var bounds = new google.maps.LatLngBounds();
      map_data.data.forEach(function(station) {
        var position = new google.maps.LatLng(station.latitude, station.longitude);
        bounds.extend(position);
        new google.maps.Marker({ position: position, map: $scope.map, title: station.nick });
      });
      map.fitBounds(bounds);
    });
    map.setOptions({
    });
  });
*/
});
