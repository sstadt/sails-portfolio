/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  create: function (req, res, next) {
    var userObj = {
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    };

    // Create a User with the params sent
    // from sign-up form --> new.js
    User.create(userObj, function userCreated(err, user) {
      // if there's an error
      if (err) {
      if (err.code === 11000) {

        var duplicateEmailError = [{
          name: 'duplicateEmailError',
          message: 'There is already an account associated with that email address.'
        }];

        // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
        // the key of usernamePasswordRequiredError
        req.session.flash = {
        err: duplicateEmailError
        };

        res.redirect('/user/new');
        return;
      }
      }

      user.save(function (err, user) {
        if (err) {
          return next(err);
        }

        res.redirect('/user');
      });

    });
  }
};

