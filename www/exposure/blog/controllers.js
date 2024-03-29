Controllers.controller('BlogController', function($scope, $transitions, Posts, $push) {

  $scope.refresh = function(force) {
    Posts.all(force)
    .then(function(posts) { $scope.posts = posts; })
    .finally(function() { $scope.$broadcast('scroll.refreshComplete'); });
  };

  $scope.refresh();

  $scope.go_dashboard = function() {
    $push.ask_for_permission("Would you like to be notified when there's new content in the blog?", "blog-content", 3);
    $transitions.go("dashboard", { type: "slide", direction: "right" });
  };
  $scope.go_detail = function(post) { $transitions.go("blog_detail", { type: "slide", direction: "left" }, { id: post.id }); };
  $scope.go_create = function() { $transitions.go("blog_create", { type: "slide", direction: "up" }); };
});

/* *************************************************************** */
/*                                                                 */
/*                    WORDPRESS DETAIL VIEW POST                   */
/*                                                                 */
/* *************************************************************** */
Controllers.controller('BlogDetailController', function($scope, $stateParams, Posts, $sce, $transitions, $cordovaSocialSharing, the_post) {
  $scope.shareable = window.cordova;
  $scope.go_list = function(post) { $transitions.go("blog", { type: "slide", direction: "right" }); };

  $scope.share_post = function(post) {
    var onSuccess = function(result) { console.log("Successfully shared."); };
    var onFailure = function(error)  { console.log("Share: got error: " + error); };
    var options = { url: post.link, subject: "Check out this blog post from The Rising", message: "This impacted me, and I thought I'd share" };

    $cordovaSocialSharing.shareWithOptions(options, onSuccess, onFailure);
  };

  $scope.open_external = function(dom_element) {
    var anchor = angular.element(dom_element);
    var link = anchor.attr("xref");
    window.open(encodeURI(link), '_system', 'location=yes');
  };
    
  $scope.post = the_post;
});

/* *************************************************************** */
/*                                                                 */
/*                    WORDPRESS POST CREATION                      */
/*                                                                 */
/* *************************************************************** */
Controllers.controller('BlogCreateController',
function($scope, $rootScope, $transitions, $cordovaCamera, $ionicActionSheet, $timeout, Posts, ExposureCodename) {
  $scope.post = { title: undefined, author: undefined, date: new Date(), content: undefined, images: [] };

  ExposureCodename.get().then(function(codename) { $scope.post.author = codename; });

  $scope.busy = false;
  $scope.submit_button_text = "Submit Post";

  $scope.submit_post = function() {
    var orig_button = $scope.submit_button_text;
    $scope.submit_button_text = "Saving Story";
    $scope.busy = true;

    Posts.create($scope.post).then(function(response) {
      $rootScope.$broadcast("dashboard.show-message", { message: "submitted-story-message" });
    }).catch(function(error) {
      console.log("Got an error creating the post: ", error);
    }).finally(function() {
	$timeout(function() {
            $transitions.go("dashboard", { type: "slide", direction: "down" }); 
	    $scope.busy = false;
	    $scope.submit_button_text = orig_button;
	}, 1200);
    });
  };

  $scope.go_list = function(post) { $transitions.go("blog", { direction: "left" }); };
  $scope.go_back = function() { $transitions.go("dashboard", { type: "slide", direction: "down" }); };

  $scope.edit_image = function (index) {
    var remove_image = function() {
      $scope.post.images.splice(index, 1);
      return true;
    };

    var replace_image = function() {
      remove_image();

      $timeout($scope.image_chooser, 250);
      return true;
    };

    var drawer = {
      buttons: [ { text: 'Replace this Image'} ],
      destructiveText: 'Remove Image from Post', destructiveButtonClicked: remove_image,
      cancelText: 'Cancel', cancel: function() { return true; },
      buttonClicked: replace_image
    };

    $ionicActionSheet.show(drawer);
  };

  $scope.image_chooser = function() {
    var failure = function(err) { console.log("Image Error: " + err); };

    var get_image = function(source, allowEditing) {
      var options = { destinationType: Camera.DestinationType.DATA_URL, sourceType: source, popoverOptions: CameraPopoverOptions,
                      encodingType: Camera.EncodingType.JPEG, saveToPhotoAlbum: false, correctOrientation: true, allowEdit: allowEditing };
      $cordovaCamera.getPicture(options)
      .then(function(imageData) {
        var image = "data:image/jpeg;base64," + imageData;
        $scope.post.images.push(image);
      }, failure);
      return true;
    };

    var drawer = {
      buttons: [ { text: 'Choose from Library' }, { text: 'Take a Photo'} ],
      cancelText: 'Cancel', cancel: function() { return true; },

      buttonClicked: function(index) {
        if (index == 0) {
          return get_image(Camera.PictureSourceType.PHOTOLIBRARY, true);
        } else {
          return get_image(Camera.PictureSourceType.CAMERA, true);
        }
      }
    };

    $ionicActionSheet.show(drawer);
  };
});
