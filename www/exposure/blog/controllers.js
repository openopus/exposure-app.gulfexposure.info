Controllers.controller('BlogController', function($scope, $transitions, Posts) {

  $scope.refresh = function(force) {
    Posts.all(force)
    .then(function(posts) { $scope.posts = posts; })
    .finally(function() { $scope.$broadcast('scroll.refreshComplete'); });
  };

  $scope.refresh();

  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "slide", direction: "right" }); };
  $scope.go_detail = function(post) { $transitions.go("blog_detail", { type: "slide", direction: "left" }, { id: post.id }); };
  $scope.go_create = function() { $transitions.go("blog_create", { type: "flip", direction: "right", duration: 600 }); };
});

Controllers.controller('BlogDetailController', function($scope, $stateParams, Posts, $sce, $transitions) {
  $scope.go_list = function(post) { $transitions.go("blog", { type: "slide", direction: "right" }); };

  Posts.get($stateParams.id).then(function(post) {
    var parser = new DOMParser(), doc;
    $scope.post = post; 

    try {
      doc = parser.parseFromString(post.content.rendered, 'text/html');
    } catch(e) {
      console.error("Got an error trying to get the detail:", e);
    }

    if (doc) {
      var html = doc.getElementsByTagName("html");
      if (html) { html = html[0]; html.className += "wordpress-parsed"; }

      post.post_content = $sce.trustAsHtml(doc.firstChild.outerHTML);
    }

    $scope.post = post;
  });
});

Controllers.controller('BlogCreateController',
function($scope, $transitions, $cordovaCamera, $ionicActionSheet, ExposureCodename) {
  $scope.post = { title: undefined, author: undefined, date: new Date(), content: undefined, images: [] };

  ExposureCodename.get().then(function(codename) { $scope.post.author = codename; });

  $scope.submit_post = function() {
    console.log("SUBMITTED!", $scope.post);
    $transitions.go("app.blog_thanks");
  };

  $scope.go_list = function(post) { $transitions.go("blog", { direction: "left" }); };
  $scope.go_back = function() { $transitions.go("dashboard", { type: "flip", direction: "left", duration: 600 }); };

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

    var drawer_options = {
      buttons: [ { text: 'Choose from Library' }, { text: 'Take a Photo'} ],
      cancel: function() { return true; },

      buttonClicked: function(index) {
        if (index == 0) {
          return get_image(Camera.PictureSourceType.CAMERA, true);
        } else {
          return get_image(Camera.PictureSourceType.PHOTOLIBRARY, true);
        }
      }
    };

    $ionicActionSheet.show(drawer_options);
  };
});
