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

  function LinkListViewModel() {

    // cache this to eliminate the need to pass context to jquery and lodash functions  
    var self = this;

    // list data
    self.links = ko.observableArray([]);

    // new link data
    self.newLinkName = ko.observable('');
    self.newLinkCaption = ko.observable('');
    self.newLinkLink = ko.observable('');

    self.addLink = function () {
      var newLink = {
        name: self.newLinkName(),
        caption: self.newLinkCaption(),
        link: self.newLinkLink()
      };

      io.socket.post('/link/create', newLink, function (response) {
        if (response.success) {
          self.links.push(new Link(response.link));
          self.newLinkName('');
          self.newLinkCaption('');
          self.newLinkLink('');
        } else {
          alert('error');
          console.log(response);
        }
      });
    };

    /**
     * Populate the project list
     */
    io.socket.get('/link/show', function (response) {
      if (response.success) {
        if (response.links.length > 0) {
          self.links(response.links);
        }
      } else {
        alert('error');
        console.log(response);
      }
    });

  } /* End of View Model */

  return {
    viewModel: LinkListViewModel,
    template: html
  };
});

