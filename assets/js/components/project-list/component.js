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
          self.selectedProject(new Project({
            name: 'New Project',
            image: response.url,
            skills: '',
            descriptiom: ''
          }));

          // open the modal
          $('#editProject').modal('show');
        }
      });

    // list data
    self.projects = ko.observableArray([]);

    // selected project data
    self.selectedProject = ko.observable({});

    // new project upload data
    self.startProjectUpload = ko.observable('0%');
    self.startProjectUploadFile = ko.observable('');

    self.saveProject = function () {
      var create = _.isUndefined(self.selectedProject().id),
        endpoint = create ? '/project/create' : '/project/update';

      io.socket.post(endpoint, self.selectedProject(), function (response) {
        if (response.success) {
          var project = new Project(response.project),
            projectIndex;

          if (create) {
            self.project.push(project);
          } else {
            projectIndex = _.findIndex(self.projects(), function (p) {
              return p.id === project.id;
            });
            self.projects.replace(self.projects()[projectIndex], project);
          }
        } else {
          alert('error');
          console.log(response.err);
        }
      });
    };

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

