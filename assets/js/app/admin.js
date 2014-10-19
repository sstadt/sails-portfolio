/*jslint browser: true*/

require(['knockout'], function (ko) {
  'use strict';

  ko.components.register('skill-list', { require: 'components/skill-list/component' });

  ko.components.register('project-list', { require: 'components/project-list/component' });

  ko.components.register('link-list', { require: 'components/link-list/component' });

  // apply character list view model to the dom
  ko.applyBindings();
});