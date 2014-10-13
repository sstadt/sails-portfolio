/*jslint browser: true*/

require(['knockout', 'dropzone'], function (ko, Dropzone) {
  'use strict';

  Dropzone.options.myAwesomeDropzone = {
    paramName: "file",
    uploadMultiple: false
  };

  var startProject = new Dropzone('#startProject', { url: '/project/start' });

  console.log(startProject);

  ko.components.register('skill-list', { require: 'components/skill-list/component' });

  // apply character list view model to the dom
  ko.applyBindings();
});