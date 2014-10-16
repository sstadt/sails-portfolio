/*jslint browser: true*/
/*globals define, confirm, alert, io*/

define([
  'jquery',
  'lodash',
  'knockout',
  'dropzone',
  'Link',
  'text!./template.html'
], function ($, _, ko, Dropzone, Link, html) {
  'use strict';

  function ProjectListViewModel() {

    // cache this to eliminate the need to pass context to jquery and lodash functions  
    var self = this;

    // list data
    self.projects = ko.observableArray([]);

    /**
     * Populate the project list
     */
    // io.socket.get('/project/show', function (response) {
    //   if (response.success) {
    //     if (response.projects.length > 0) {
    //       self.projects(response.projects);
    //     }
    //   } else {
    //     alert('error');
    //     console.log(response);
    //   }
    // });

  } /* End of View Model */

  return {
    viewModel: LinkListViewModel,
    template: html
  };
});

