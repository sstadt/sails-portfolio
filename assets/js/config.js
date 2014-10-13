/*jslint browser: true*/
/*globals requirejs, alert, confirm, io*/

requirejs.config({
  paths: {
    // plugins
    'text': 'vendor/requirejs-text/text',

    // vendor
    'sails': 'vendor/sails.io.js/dist/sails.io',
    'jquery': 'vendor/jquery/dist/jquery',
    'lodash': 'vendor/lodash/dist/lodash',
    'bootstrap': 'vendor/bootstrap/dist/js/bootstrap',
    'knockout': 'vendor/knockout/dist/knockout',
    'dropzone': 'vendor/dropzone/downloads/dropzone',

    // classes
    'Skill': 'lib/classes/Skill',
    'Character': 'lib/classes/Character',
    'CharacterClass': 'lib/classes/CharacterClass',

    // util
    'statistics': 'lib/statistics'
  },
  shim: {
    'bootstrap': {
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



