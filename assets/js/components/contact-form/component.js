/*jslint browser: true*/
/*globals define, confirm, alert, io*/

define([
  'knockout',
  'text!./template.html',
  'bsvalidate'
], function (ko, html) {
  'use strict';

  function ContactFormViewModel() {

    // cache this to eliminate the need to pass context to jquery and lodash functions  
    var self = this,
      contactForm = $('#contact-form').bootstrapValidator({
        message: 'This value is not valid',
        submitButtons: 'button[type="submit"]',
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          contactName: {
            validators: {
              notEmpty: {
                message: 'Name is required and can\'t be empty'
              }
            }
          },
          contactEmail: {
            validators: {
              notEmpty: {
                message: 'Email is required and can\'t be empty'
              },
              emailAddress: {
                message: 'The input is not a valid email address'
              }
            }
          },
          contactSubject: {
            validators: {
              notEmpty: {
                message: 'Subject is required and can\'t be empty'
              }
            }
          },
          contactMessage: {
            validators: {
              notEmpty: {
                message: 'Message is required and can\'t be empty'
              }
            }
          }
        }
      }).on('success.form.bv', function (e) { e.preventDefault(); });

    // contact form data
    self.name = ko.observable('');
    self.email = ko.observable('');
    self.subject = ko.observable('');
    self.message = ko.observable('');

    // throttling
    self.sending = ko.observable(false);

    self.sendMessage = function () {
      if (!self.sending() && contactForm.data('bootstrapValidator').isValid()) {
        self.sending(true);

        var message = {
          name: self.name(),
          email: self.email(),
          subject: self.subject(),
          message: self.message()
        };

        io.socket.post('/static/contact', message, function (response) {
          if (response.success) {
            alert('Message sent!');

            self.name('');
            self.email('');
            self.subject('');
            self.message('');
            self.sending(false);
            contactForm.data('bootstrapValidator').resetForm(true);
          } else {
            alert(response);
          }
        });
      }
    };

  } /* End of View Model */

  return {
    viewModel: ContactFormViewModel,
    template: html
  };
});

