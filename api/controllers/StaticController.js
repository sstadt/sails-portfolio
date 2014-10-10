/**
 * StaticController
 *
 * @description :: Server-side logic for managing Statics
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  portfolio: function (req, res) {
    res.view({
      title: 'Portfolio'
    });
  },
  admin: function (req, res) {
    res.view({
      title: 'Admin'
    });
  }
};

