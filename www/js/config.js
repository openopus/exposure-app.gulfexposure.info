App.config(function($ionicConfigProvider, $provide) {
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $provide.decorator('$q', function ($delegate) {
    var $q = $delegate;

    // Extension for $q
    $q.settled = function (promises) {
      var deferred = $q.defer();
      if (angular.isArray(promises)) {
	var states = [];
	var results = [];
	var didAPromiseFail = false;

	/* Create an array for all promises setting their state to false (not completed). */
	angular.forEach(promises, function (promise, key) {
	  states[key] = false;
	});

	var checkStates = function (states, results, deferred, failed) {
	  var allFinished = true;
	  angular.forEach(states, function (state, key) {
	    if (!state) {
	      allFinished = false;
	      return;
	    }
	  });

	  if (allFinished) {
	    if (failed) {
	      deferred.reject(results);
	    } else {
	      deferred.resolve(results);
	    }
	  }
	};

	/* Loop through the promises, checking each one. A second loop to be sure that checkStates
           is called when all states are set to false first */
	angular.forEach(promises, function (promise, key) {
	  $q.when(promise).then(function (result) {
	    states[key] = true;
	    results[key] = result;
	    checkStates(states, results, deferred, didAPromiseFail);
	  }, function (reason) {
	       states[key] = true;
	       results[key] = reason;
	       didAPromiseFail = true;
	       checkStates(states, results, deferred, didAPromiseFail);
	     });
	});
      } else {
	throw 'allSettled can only handle an array of promises (for now)';
      }
      return deferred.promise;
    };
    return $q;
  });
});