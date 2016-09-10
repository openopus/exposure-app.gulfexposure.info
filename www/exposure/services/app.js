Factories.factory("$app", function($rootScope) {
  var service = { network: null, online: null };

  document.addEventListener("online", function(network_type) {
    service.network = network_type.type;
    service.online = true;
    $rootScope.$broadcast("$app:network-online");
  });

  document.addEventListener("offline", function(network_type) {
    service.network = network_type.type;
    service.online = false;
    $rootScope.$broadcast("$app:network-offline");
  });

  return service;
});
