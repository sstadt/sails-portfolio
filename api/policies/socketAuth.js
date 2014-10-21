/**
 * socketAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function (req, res, next) {

  if (!req.session.authenticated) {
    res.json({ err: 'You are not permitted to perform this action.' });
  } else {
    return next();
  }
};
