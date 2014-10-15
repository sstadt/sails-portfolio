/*jslint browser: true*/
/*globals define, confirm, alert, io*/

define([
  'jquery',
  'lodash',
  'knockout',
  'dropzone',
  'Project',
  'text!./template.html'
], function ($, _, ko, Dropzone, Project, html) {
  'use strict';

  function ProjectListViewModel() {
    
    var self = this, // cache this to eliminate the need to pass context to jquery and lodash functions
      startProject = new Dropzone('#startProject', {
        url: '/project/start',
        addedfile: function (file) {
          self.startProjectUploadFile(file.name);
        },
        uploadprogress: function (file, progress) {
          self.startProjectUpload(progress + '%');
        },
        success: function (file, response) {
          // reset progress bar
          self.startProjectUpload('0%');

          // start new project
          self.newProjectName = ko.observable('New Project');
          self.newProjectImage(response.url);
          self.newProjectSkills = ko.observable('');
          self.newProjectDescription = ko.observable('');

          // open the modal
        }
      });

    // list data
    self.projects = ko.observableArray([]);

    // selected project data
    self.selectedProject = ko.observable();

    // new project upload data
    self.startProjectUpload = ko.observable('0%');
    self.startProjectUploadFile = ko.observable('');

    // new project data
    self.newProjectName = ko.observable();
    self.newProjectImage = ko.observable();
    self.newProjectSkills = ko.observable();
    self.newProjectDescription = ko.observable();

    // io.socket.get('/skill/show', function (response) {
    //   if (response.success) {
    //     if (response.skills.length > 0) {
    //       var design = _.filter(response.skills, function (skill) {
    //           return skill.category === 'design';
    //         }).map(self.createSkill),
    //         development = _.filter(response.skills, function (skill) {
    //           return skill.category === 'development';
    //         }).map(self.createSkill);

    //       self.design(design);
    //       self.development(development);
    //     }
    //   } else {
    //     alert('error');
    //     console.log(response);
    //   }
    // });

  } /* End of View Model */

  return {
    viewModel: ProjectListViewModel,
    template: html
  };
});

