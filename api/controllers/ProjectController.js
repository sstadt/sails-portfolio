/*jslint node: true*/
/*globals Project, sails*/

/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs'),
  md5 = require('md5');

module.exports = {

  start: function (req, res) {
    req.file('file').upload(function (err, file) {
      if (err) {
        res.serverError('Unable to upload file.', err);
      } else {
        console.log(file);

        var AWS = require('aws-sdk'),
          fs = require('fs');

        // For dev purposes only
        AWS.config.update({ accessKeyId: sails.config.s3.key, secretAccessKey: sails.config.s3.secret });

        // Read in the file, convert it to base64, store to S3
        fs.readFile(file[0].fd, function (err, data) {

          if (err) {
            res.serverError('Unable to read file', err);
          } else {
            var s3 = new AWS.S3(),
              filename = 'projects/' + file[0].filename,
              url = 'https://' + sails.config.s3.bucket + '.s3.amazonaws.com/' + filename;

            s3.putObject({
              Bucket: sails.config.s3.bucket,
              Key: filename,
              Body: data,
              ACL: 'public-read',
              ContentType: file[0].type
            }, function (err, data) {
              if (err) {
                res.serverError('Error pushing object to s3', err);
              } else {
                // clear the temporary file
                fs.unlink(file[0].fd);

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

    // req.file('file').upload({
    //   adapter: require('skipper-s3'),
    //   bucket: sails.config.s3.bucket,
    //   key: sails.config.s3.key,
    //   secret: sails.config.s3.secret
    // }, function (err, file) {
    //   if (err) {
    //     console.log(err);
    //     res.serverError('Unable to upload file.', err);
    //   } else {
    //     res.json({
    //       success: true,
    //       file: file
    //     });
    //   }
    // });
  },

  create: function (req, res) {
    var newProject = {
      name: req.param('name'),
      link: req.param('link'),
      skills: req.param('skills'),
      description: req.param('description')
    };

    Project.create(newProject, function (err, project) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          success: true,
          project: project
        });
      }
    });
  },

  update: function (req, res) {
    var updatedProject = {
      name: req.param('name'),
      link: req.param('link'),
      skills: req.param('skills'),
      description: req.param('description')
    };

    Project.update(req.param('id'), updatedProject, function (err, project) {
      if (err) {
        res.json(err);
      } else {
        res.jason({
          success: true,
          project: project
        });
      }
    });
  },

  show: function (req, res) {
    Project.find(function (err, projects) {
      if (err) {
        res.json(err);
      } else {
        req.json({
          success: true,
          projects: projects
        });
      }
    });
  },

  destroy: function (req, res) {
    Project.destroy(req.param('id'), function (err) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          success: true
        });
      }
    });
  }

};

