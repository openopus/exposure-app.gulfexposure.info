angular.module('angular-content-editable', [])

.directive('contentEditable', function ($log,$sce,$compile,$window,contentEditable) {
  var directive = {
    restrict: 'A',
    require: '?ngModel',
    scope: { editCallback: '=', ngModel: '=' },
    link: _link
  }

  return directive;

  function _link(scope, elem, attrs, ngModel) {

    // return if ng model not specified
    if(!ngModel) {
      $log.warn('Error: ngModel is required in elem: ', elem);
      return;
    }

    var noEscape = true;
    var originalElement = elem[0];
    var placeholder = null;
    // get default usage options
    var options = angular.copy(contentEditable);
    // update options with attributes
    angular.forEach(options, function (val, key) {
      if (key in attrs && typeof attrs[key] !== 'undefined') { options[key] = attrs[key]; }
    })

    // if model is invalid or null
    // fill his value with elem html content
    if (!scope.ngModel) {
      placeholder = elem.html();
      elem.css("opacity", "0.7");
      elem.css("font-style", "italic");
      // ngModel.$setViewValue(elem.html());
    }

    // Add editable class.
    attrs.$addClass(options.editableClass);

    // render always with model value
    ngModel.$render = function() {
      if (!scope.ngModel)
        elem.html(placeholder || "Edit this area");
      else
        elem.html(ngModel.$modelValue || '');
    }

    // handle click on element
    function onClick(e){
      e.preventDefault();
      attrs.$set('contenteditable', 'true');
      if (elem.html() == placeholder) {
        elem.html("");
        elem.css("opacity", "1.0");
        elem.css("font-style", "inherit");
      }
      return originalElement.focus();
    }

    // check some option extra
    // conditions during focus
    function onFocus(e) {
      // turn on the flag
      noEscape = true;
      // select all on focus
      if (options.focusSelect) {
        var range = $window.document.createRange();
        range.selectNodeContents( originalElement );
        $window.getSelection().addRange(range);
      }
    }

    function onBlur(e) {
      // the text
      var html;

      // disable editability
      attrs.$set('contenteditable', 'false');

      // if text needs to be rendered as html
      if (options.renderHtml && noEscape) {
        // get plain text html (with html tags)
        // replace all blank spaces
        html = originalElement.textContent.replace(/\u00a0/g, " ");
        // update elem html value
        if (!html) {
          html = placeholder;
          elem.css("opacity", "0.7");
          elem.css("font-style", "italic");
        } else {
          elem.css("opacity", "1.0");
          elem.css("font-style", "inherit");
        }
        
        elem.html(html);
      } else {
        html = elem.html();
        if (!html) {
          elem.html(placeholder);
          elem.css("opacity", "0.7");
          elem.css("font-style", "italic");
        }
      }

      // if element value is
      // different from model value
      if (html != ngModel.$modelValue) {
        /* This method should be called  when a controller wants to change the view value. */
        if (html) ngModel.$setViewValue(html);
        /* if user passed a variable and is a function */
        if (scope.editCallback && angular.isFunction(scope.editCallback)) {
          /* Apply the callback with arguments: current text and element. */
          return scope.$apply(scope.editCallback(html, elem));
        }
      }
    }

    function onKeyDown(e) {
      // on tab key blur and
      // TODO: focus to next
      if (e.which == 9) {
        originalElement.blur();
        return;
      }

      // on esc key roll back value and blur
      if (e.which == 27) {
        ngModel.$rollbackViewValue();
        noEscape = false;
        return originalElement.blur();
      }

      // if single line or ctrl key is
      // pressed trigger the blur event
      if (e.which == 13 && (options.singleLine || e.ctrlKey)) {
        return originalElement.blur();
      }
    }

    /**
     * On click turn the element
     * to editable and focus it
     */
    elem.bind('click', onClick);

    /**
     * On element focus
     */
    elem.bind('focus', onFocus);

    /**
     * On element blur turn off
     * editable mode, if HTML, render
     * update model value and run callback
     * if specified
     */
    elem.bind('blur', onBlur);

    /**
     * Bind the keydown event for many functions
     * TODO: more to come
     */
    elem.bind('keydown', onKeyDown);

    /**
     * On element destroy, remove all event
     * listeners related to the directive
     * (helps to prevent memory leaks)
     */
    scope.$on('$destroy', function () {
      try {
        elem.unbind(onClick);
        elem.unbind(onFocus);
        elem.unbind(onBlur);
      } catch(e) {
        console.log("Robust?");
      }
    })
  }
})

/**
 * Provider to setup the default
 * module options for the directive
 */
.provider('contentEditable', function () {

  var defaults = {
    editableClass: 'editable',
    keyBindings: true, // default true for key shortcuts
    singleLine: false,
    focusSelect: false, // default on focus select all text inside
    renderHtml: false,
    editCallback: false
  }

  this.configure = function (options) {
    return angular.extend(defaults, options);
  }

  this.$get = function () {
    return defaults;
  }

})

App.requires.push('angular-content-editable');

