// routes.js: -*- JavaScript-IDE -*-  DESCRIPTIVE TEXT.
//
// Copyright (c) 2016 Brian J. Fox
// Author: Brian J. Fox (bfox@opuslogica.com) Tue Aug 16 18:45:58 2016.
App.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('blog', {
    url: '/blog/list',
    templateUrl: 'exposure/blog/list.html',
    controller: 'BlogController'
  })

  .state('blog_detail', {
    url: '/blog/show/:id',
    resolve: {
      the_post: function($q, $stateParams, $sce, Posts) {
        var defer = $q.defer();
        Posts.get($stateParams.id).then(function(post) {
          var parser = new DOMParser(), doc;
          try {
            doc = parser.parseFromString(post.content.rendered, 'text/html');
          } catch(e) {
            console.error("Got an error trying to get the detail:", e);
          }
          if (doc) {
            var html = doc.getElementsByTagName("html");
            var anchors = doc.getElementsByTagName("a");

            if (html) { html = html[0]; html.className += "wordpress-parsed"; }

            if (anchors) {
              for (var i = 0; i < anchors.length; i++) {
                var anchor = angular.element(anchors[i]);
                anchor.attr("target", "_system");
              }
            }

            post.post_content = $sce.trustAsHtml(doc.firstChild.outerHTML);
          }
          defer.resolve(post);
        });
        return defer.promise;
      }
    },
    templateUrl: 'exposure/blog/detail.html',
    controller: 'BlogDetailController'
  })

  .state('blog_create', {
    url: '/blog/create',
    templateUrl: 'exposure/blog/create.html',
    controller: 'BlogCreateController'
  })

  .state('blog_thanks', {
    url: '/blog/thanks',
    templateUrl: 'exposure/blog/thanks.html',
    controller: 'BlogCreateController'
  })
});
