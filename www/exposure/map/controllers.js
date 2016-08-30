Controllers.controller('MapController', function($scope, $rootScope, $timeout, $api, $timeout, $transitions, NgMap) {

  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "slide", direction: "right" }); };

  $scope.update_markers = function() {
    console.log("I hope this is unnecessary.")
  };

  $scope.map_setup = function() {
    var heatmap = document.getElementById("exposure-heatmap");
    var win_height = window.innerHeight;
    var heatmap_top = heatmap.getBoundingClientRect().top;
    angular.element(heatmap).css("min-height",  "" + win_height - heatmap_top + "px");
    google.maps.event.trigger($scope.map, 'resize');

    try {
      $api.get("heatmap").then(function(response) {
        var markers = [];
        var data = response.data;
        var bounds = new google.maps.LatLngBounds();

        for (var i = data.length - 1; i > -1; i--) {
          var latlng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
          var marker = new google.maps.Marker({ title: data[i].codename, position: latlng, map: $scope.map });
          markers.push(marker);
          bounds.extend(latlng);
        }
        $scope.markers = markers;
        $scope.heatmap = data;
        $scope.update_markers();
        $scope.map.fitBounds(bounds);
      });
    } catch(x) {
      console.error("Couldn't talk to the API server in map/controllers.js", x);
    }

    var success = function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var ctr  = new google.maps.LatLng(lat, lng);
    }
    var failure = function(why) { console.error("Ah, you failed.  Here's why: ", why); };
    navigator.geolocation.getCurrentPosition(success, failure, { timeout: 30000 });
  };

  NgMap.getMap("exposure-heatmap").then(function(map) {
    $scope.map = map;
    $scope.map_setup();
  });

});
