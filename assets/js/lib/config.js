/*jslint browser: true*/
/*globals requirejs, alert, confirm, io*/

requirejs.config({
  paths: {
    // plugins
    'text': 'vendor/requirejs-text/text',

    // vendor
    'sails': 'vendor/sails.io.js/dist/sails.io',
    'jquery': 'vendor/jquery/dist/jquery',
    'fittext': 'vendor/fittext/fittext',
    'lodash': 'vendor/lodash/dist/lodash',
    'bootstrap': 'vendor/bootstrap/dist/js/bootstrap',
    'bsvalidate': 'vendor/bootstrapValidator/dist/js/bootstrapValidator',
    'knockout': 'vendor/knockout/dist/knockout',
    'dropzone': 'vendor/dropzone/downloads/dropzone',
    'hotkeys': 'vendor/bootstrap-wysiwyg/external/jquery.hotkeys',
    'wysiwyg': 'vendor/bootstrap-wysiwyg/bootstrap-wysiwyg',

    // classes
    'Post': 'lib/classes/Post',
    'Skill': 'lib/classes/Skill',
    'Project': 'lib/classes/Project',
    'Link': 'lib/classes/Link',
    'Image': 'lib/classes/Image'
  },
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    'bsvalidate': {
      deps: ['bootstrap']
    },
    'hotkeys': {
      deps: ['jquery']
    },
    'wysiwyg': {
      deps: ['jquery', 'hotkeys', 'bootstrap']
    },
    'fittext': {
      deps: ['jquery']
    }
  },
  deps: [
    'knockout', 'jquery', 'sails', 'bootstrap'
  ],
  callback: function (ko, $) {

    /* Custom Data Bindings
    ------------------------------*/

    /**
     * Custom binding for elements which contain the
     * contenteditable="true" attribute. Gives them
     * identical behavior to an input element with
     * the value binding.
     */
    ko.bindingHandlers.editableText = {
      init: function (element, valueAccessor) {
        $(element).on('blur', function () {
          var observable = valueAccessor();
          observable($(this).text());
        });
      },
      update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).text(value);
      }
    };

    ko.bindingHandlers.htmlValue = {
      init: function(element, valueAccessor, allBindingsAccessor) {
        var updateHandler = function() {
          var modelValue = valueAccessor(),
            elementValue = element.innerHTML;

          //update the value on keyup
          modelValue(elementValue);
        };

        ko.utils.registerEventHandler(element, "keyup", updateHandler);
        ko.utils.registerEventHandler(element, "input", updateHandler);
      },
      update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || "",
          current = element.innerHTML;

        if (value !== current) {
          element.innerHTML = value;    
        }
      }
    };

  }
});



