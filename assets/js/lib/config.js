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
    'wysiwyg': {
      deps: ['bootstrap']
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

  }
});



