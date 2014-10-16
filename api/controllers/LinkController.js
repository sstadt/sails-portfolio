/*jslint node: true*/
/*globals Link*/

/**
 * LinkController
 *
 * @description :: Server-side logic for managing Links
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  show: function (req, res) {
    Link.find(function (err, links) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          success: true,
          links: links
        });
      }
    });
  },

  create: function (req, res) {
    var newLink = {
      name: req.param('name'),
      caption: req.param('caption'),
      link: req.param('link')
    };

    Link.create(newLink, function (err, link) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          success: true,
          link: link
        });
      }
    });
  },

  update: function (req, res) {
    var updatedLink = {
      name: req.param('name'),
      caption: req.param('caption'),
      link: req.param('link')
    };

    Link.update(req.param('id'), updatedLink, function (err, link) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          success: true,
          link: link
        });
      }
    });
  },

  destroy: function (req, res) {
    Link.destroy(req.param('id'), function (err) {
      if (err) {
        res.json(err);
      } else {
        res.json({ success: true });
      }
    });
  }

};

