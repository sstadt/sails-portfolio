/*jslint node: true*/
/*globals Gallery, sails*/

/**
 * GalleryController
 *
 * @description :: Server-side logic for managing Galleries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var aws = require('../services/aws.js'),
  s3path = 'gallery';

module.exports = {

  show: function (req, res) {
    Gallery.find(function (err, images) {
      if (err) {
        console.log(err);
        res.serverError('Unable to find gallery images');
      } else {
        res.json({
          success: true,
          images: images
        });
      }
    });
  },

  upload: function (req, res) {
    req.file('file').upload(function (err, file) {
      if (err) {
        res.serverError('Unable to upload file.', err);
      } else {
        aws.upload(file[0], sails.config.s3.bucket, s3path, function (err, url) {
          if (err) {
            res.serverError(err.msg, err.err);
          } else {
            Gallery.create({ link: url }, function (err) {
              if (err) {
                res.serverError(err.msg, err.err);
              } else {
                res.json({
                  success: true,
                  url: url
                });
              }
            });
          }
        });
      }
    });
  },

  destroy: function (req, res) {
    Gallery.destroy(req.param('id'), function (err) {
      if (err) {
        console.log(err);
        res.serverError('Error removing gallery image.');
      } else {
        res.json({ success: true });
      }
    });
  }

};

