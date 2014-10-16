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
      editProjectModal = $('#editProject'),
      uploadEndpoint = '/project/upload',
      startProject = new Dropzone('#startProject', {
        url: uploadEndpoint,
        addedfile: function (file) {
          self.startProjectUploadFile(file.name);
        },
        uploadprogress: function (file, progress) {
          self.startProjectUpload(progress + '%');
        },
        success: function (file, response) {
          if (response.success) {
            // start new project
            self.selectedProject(new Project({
              name: 'New Project',
              image: response.url,
              skills: '',
              descriptiom: ''
            }));

            // open the modal
            editProjectModal.modal('show');
          } else {
            alert('error');
            console.log(response);
          }
        }
      }),
      changeProjectImage = new Dropzone('#changeProjectImage', {
        url: uploadEndpoint,
        addedfile: function (file) {
          self.changeProjectUploadFile(file.name);
        },
        uploadprogress: function (file, progress) {
          self.changeProjectUpload(progress + '%');
        },
        success: function (file, response) {
          if (response.success) {
            self.selectedProject().image = response.url;
            self.selectedProject.valueHasMutated();
            self.changeProjectUploadFile('');
          } else {
            alert('error');
            console.log(response);
          }
        }
      });

    // list data
    self.projects = ko.observableArray([]);

    // selected project data
    self.selectedProject = ko.observable({});

    // upload data
    self.startProjectUpload = ko.observable('0%');
    self.startProjectUploadFile = ko.observable('');
    self.changeProjectUpload = ko.observable('0%');
    self.changeProjectUploadFile = ko.observable('');

    /**
     * Set a project as selected for editing
     * @param  {Project} project The project to set as selected
     * @return {void}
     */
    self.editProject = function (project) {
      // update projects
      self.selectedProject(project);

      // open modal
      editProjectModal.modal('show');
    };

    /**
     * Save updates to a project
     * @return {void}
     */
    self.saveProject = function () {
      var newProject = _.isUndefined(self.selectedProject().id),
        endpoint = newProject ? '/project/create' : '/project/update';

      io.socket.post(endpoint, self.selectedProject(), function (response) {
        if (response.success) {
          var project = new Project(response.project),
            projectIndex;

          // update projects
          if (newProject) {
            self.startProjectUpload('0%');
            self.startProjectUploadFile('');
            self.projects.push(project);
            self.selectedProject(project);
          } else {
            projectIndex = _.findIndex(self.projects(), function (p) {
              return p.id === project.id;
            });
            self.projects.replace(self.projects()[projectIndex], project);
          }

          // close the modal
          editProjectModal.modal('hide');
        } else {
          alert('error');
          console.log(response.err);
        }
      });
    };

    /**
     * Remove a project
     * @param  {Project} project The project to be removed
     * @return {void}
     */
    self.removeProject = function (project) {
      if (confirm('Are you sure you want to remove this project?')) {
        io.socket.post('/project/destroy', { id: project.id }, function (response) {
          if (response.success) {
            self.projects.destroy(project);
          } else {
            alert('error');
            console.log(response);
          }
        });
      }
    };

    /**
     * Populate the project list
     */
    io.socket.get('/project/show', function (response) {
      if (response.success) {
        if (response.projects.length > 0) {
          self.projects(response.projects);
        }
      } else {
        alert('error');
        console.log(response);
      }
    });

  } /* End of View Model */

  return {
    viewModel: ProjectListViewModel,
    template: html
  };
});

