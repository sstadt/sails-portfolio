/*jslint browser: true*/
/*globals define, confirm, alert, io*/

define([
  'knockout',
  'dropzone',
  'Image',
  'text!./template.html'
], function (ko, Dropzone, Image, html) {
  'use strict';

  function GalleryListViewModel() {

    var self = this, // cache this to eliminate the need to pass context to jquery and lodash functions
      uploadEndpoint = '/gallery/upload',
      startProject = new Dropzone('#addImage', {
        url: uploadEndpoint,
        addedfile: function (file) {
          self.startImageUploadFile(file.name);
        },
        uploadprogress: function (file, progress) {
          self.startImageUpload(progress + '%');
        },
        success: function (file, response) {
          if (response.success) {
            // add the image
            self.images.push(new Image({
              id: response.id,
              link: response.url
            }));
            self.startImageUploadFile('');
          } else {
            alert('error');
            console.log(response);
          }
        }
      });

    // list data
    self.images = ko.observableArray([]);

    // upload data
    self.startImageUpload = ko.observable('0%');
    self.startImageUploadFile = ko.observable('');

    /**
     * Remove an image
     * @param  {Image} image The image to be removed
     * @return {void}
     */
    self.removeImage = function (image) {
      if (confirm('Are you sure you want to remove this image?')) {
        io.socket.post('/gallery/destroy', { id: image.id }, function (response) {
          if (response.success) {
            self.images.destroy(image);
          } else {
            alert('error');
            console.log(response);
          }
        });
      }
    };

    /**
     * Populate the image list
     */
    io.socket.get('/gallery/show', function (response) {
      if (response.success) {
        if (response.images.length > 0) {
          self.images(response.images.map(function (image) {
            return new Image(image);
          }));
        }
      } else {
        alert('error');
        console.log(response);
      }
    });

  } /* End of View Model */

  return {
    viewModel: GalleryListViewModel,
    template: html
  };
});

