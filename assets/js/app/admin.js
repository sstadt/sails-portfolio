/*jslint browser: true*/

require(['knockout', 'dropzone'], function (ko, Dropzone) {
  'use strict';

  ko.components.register('skill-list', { require: 'components/skill-list/component' });

  ko.components.register('project-list', { require: 'components/project-list/component' });

  // apply character list view model to the dom
  ko.applyBindings();
});