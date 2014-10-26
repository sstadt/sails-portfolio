/*jslint node: true*/
/*globals User*/

/**
 * SessionController
 *
 * @description :: Server-side logic for managing Sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

  'new': function (req, res) {
    res.view({
      template: 'session/new',
      title: 'login'
    });
  },

  create: function (req, res) {

    if (!req.param('email') || !req.param('password')) {

      var usernamePasswordRequiredError = [{
        name: 'usernamePasswordRequired',
        message: 'You must enter both a username and password.'
      }];

      req.session.flash = {
        err: usernamePasswordRequiredError
      };

      res.redirect('/session/new');
    } else {

      User.findOne({ email: req.param('email') }, function (err, user) {
        if (err) {
          console.log(err);
          res.serverErro('Error retrieving user');

        // If no user is found...
        } else if (!user) {
          var noAccountError = [{
            name: 'noAccount',
            message: 'The email address ' + req.param('email') + ' was not found.'
          }];

          req.session.flash = {
            err: noAccountError
          };

          res.redirect('/session/new');
        } else {

          // Compare password from the form params to the encrypted password of the user found.
          bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {
            if (err) {
              console.log(err);
              res.serverError('There was an error logging you in');

            // log user in
            } else if (valid) {
              req.session.authenticated = true;
              req.session.User = user;
              res.redirect('/admin');

            // If the password from the form doesn't match the password from the database...
            } else {
              var usernamePasswordMismatchError = [{
                name: 'usernamePasswordMismatch',
                message: 'Invalid username and password combination.'
              }];

              req.session.flash = {
                err: usernamePasswordMismatchError
              };

              res.redirect('/session/new');
            }
          });
        }
      });
    }

  },

  destroy: function (req, res) {
    User.findOne(req.session.User.id, function foundUser(err) {
      if (err) {
        res.serverError('Could not find user');
      } else {
        req.session.destroy();
        res.redirect('/');
      }
    });
  }
};

