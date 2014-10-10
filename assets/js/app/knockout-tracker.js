/*jslint browser: true*/

require(['knockout'], function (ko) {
  'use strict';

  // register the main character list component
  ko.components.register('character-list', { require: 'components/knockout/character-list/component' });

  // apply character list view model to the dom
  ko.applyBindings();
});