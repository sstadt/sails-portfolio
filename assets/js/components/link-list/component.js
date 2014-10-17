/*jslint browser: true*/
/*globals define, confirm, alert, io*/

define([
  'lodash',
  'knockout',
  'Link',
  'text!./template.html'
], function (_, ko, Link, html) {
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

    /**
     * Add a new link to the list
     * @return {void}
     */
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
     * Toggle a link's edit state
     * @param  {Link} link The link to make editable
     * @return {void}
     */
    self.toggleEdit = function (link) {
      var linkIndex = _.findIndex(self.links(), function (l) {
        return link.id === l.id;
      });

      link.edit = !link.edit;
      self.links.replace(self.links()[linkIndex], new Link(link));
    };

    /**
     * Update a link
     * @param  {Link} link The link to update
     * @return {void}
     */
    self.updateLink = function (link) {
      var updatedLink = {
        id: link.id,
        name: link.tempName,
        caption: link.tempCaption,
        link: link.tempLink
      };

      io.socket.post('/link/update', updatedLink, function (response) {
        if (response.success) {
          var linkIndex = _.findIndex(self.links(), function (l) {
            return link.id === l.id;
          });

          console.log(response);

          self.links.replace(self.links()[linkIndex], new Link(response.link));
        } else {
          alert('error');
          console.log(response);
        }
      });
    };

    /**
     * Remove a link from the list
     * @param  {Link} link The Link object to remove from the list
     * @return {void}
     */
    self.removeLink = function (link) {
      if (confirm("Are you sure you want to remove this link?")) {
        io.socket.post('/link/destroy', { id: link.id }, function (response) {
          if (response.success) {
            self.links.destroy(link);
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
    io.socket.get('/link/show', function (response) {
      if (response.success) {
        if (response.links.length > 0) {
          self.links(response.links.map(function (link) {
            return new Link(link);
          }));
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

