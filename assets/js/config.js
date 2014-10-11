/*jslint browser: true*/
/*globals requirejs, alert, confirm, io*/

requirejs.config({
  paths: {
    // plugins
    'text': 'plugins/text',

    // vendor
    'sails': 'vendor/sails.io',
    'jquery': 'vendor/jquery-2.1.1',
    'jeditable': 'vendor/jquery.jeditable',
    'lodash': 'vendor/lodash.compat',
    'bootstrap': 'vendor/bootstrap',
    'knockout': 'vendor/knockout-3.2.0',

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
    },
    'jeditable': {
      deps: ['jquery']
    }
  },
  deps: [
    'knockout', 'jquery', 'jeditable', 'sails', 'bootstrap'
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

    ko.bindingHandlers.jeditable = {
      init: function (element, valueAccessor, allBindingsAccessor) {
        // get the options that were passed in
        var options = allBindingsAccessor().jeditableOptions || {};

        // "submit" should be the default onblur action like regular ko controls
        if (!options.onblur) {
          options.onblur = 'submit';
        }

        // set the value on submit and pass the editable the options
        $(element).editable(function (value) {
          valueAccessor()(value);
          return value;
        }, options);

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
          $(element).editable("destroy");
        });
      },

      //update the control when the view model changes
      update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).html(value);
      }
    };
  }
});



