/*jslint browser: true*/
/*globals define*/

define([
  'knockout',
  'jquery',
  'sails',
  'bootstrap'
], function (ko, $) {
  'use strict';

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
  
});