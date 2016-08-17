Controllers.controller('BlogController', function($scope, $state, Posts) {
  
  Posts.getPosts().then(function(result) {
    $scope.posts = result;
  });
  
  $scope.back_clicked = function() { $state.go("app.dashboard"); };
  $scope.go_detail = function(post) { $state.go("app.blog_detail", { id: post.id }); };
  $scope.go_create = function() { $state.go("app.blog_create"); };
});

Controllers.controller('BlogDetailController', function($scope, $stateParams, Posts, $sce) {
  var post = Posts.getPost($stateParams.id);
  var parser = new DOMParser(), doc;

  $scope.back_clicked = function() { $state.go("app.blog"); };

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

Controllers.controller('BlogCreateController', function($scope, $state) {
  $scope.post = { title: "Your Post Title", date: new Date(), content: "<p>This is some content.  Don't know how <b>things</b> will look.</p>" };

  $scope.submit_post = function() {
    console.log("SUBMITTED!", $scope.post);
    $state.go("app.blog_thanks");
  };
});

Controllers.controller('CreateAPostCtrl', function($scope, $cordovaCamera, $cordovaImagePicker, $ionicActionSheet, Posts, $localstorage, $state) {
  $scope.photos_to_upload = [];

  $scope.select_from_library = function() {
    var options = {
      maximumImagesCount: 1,
      quality: 85
    };
    $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      imageData = results[0];
      $localstorage.set("image",  imageData);
      $scope.photos_to_upload.push(imageData);
    }, function(error) {
         console.log(error);
       });
  };

  $scope.take_photo = function() {
    var options = {
      quality: 85,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log("storing image here as " + imageData);
      $localstorage.set("image",  imageData);
      $scope.photos_to_upload.push(imageData);
    }, function(err) {
         console.log(err);
       });
  };

  $scope.select_image = function() {
    var options = {
      buttons: [
        { text: 'Choose from Library' },
        { text: 'Take a photo'}
      ],
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        // SELECT FROM LIBRARY
        if (index == 0) {
          $scope.select_from_library();
          return true;
        }

        // TAKE PHOTO
        if (index == 1) {
          $scope.take_photo();
          return true;
        }
      }
    };

    $ionicActionSheet.show(options);
  };

  $scope.submit_image = function(title, content) {
    var image = $localstorage.get("image");

    Posts.createPost(title,content, image).then(function() {
      $state.go('posts');
    });
  }
});
