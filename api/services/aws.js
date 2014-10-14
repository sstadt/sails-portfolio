/*jslint node: true*/
/*globals sails*/

var AWS = require('aws-sdk'),
  fs = require('fs');

// initialize config
AWS.config.update({ accessKeyId: sails.config.s3.key, secretAccessKey: sails.config.s3.secret });

module.exports = {

  /**
   * Upload a file to s3
   * @param  {object}   file     The file upload object
   * @param  {string}   bucket   The s3 bucket to store the file in
   * @param  {string}   path     The path the file will be stored in on s3
   * @param  {Function} callback Callback function to execute when finished uploading
   * @return {void}
   */
  upload: function (file, bucket, path, callback) {

    // Read in the file, convert it to base64, store to S3
    fs.readFile(file.fd, function (err, data) {
      if (err) {
        callback(err);
      } else {
        var s3 = new AWS.S3(),
          filename = path + '/' + file.filename,
          url = 'https://' + bucket + '.s3.amazonaws.com/' + filename;

        // push to s3
        s3.putObject({
          Bucket: bucket,
          Key: filename,
          Body: data,
          ACL: 'public-read',
          ContentType: file.type
        }, function (err) {
          fs.unlink(file.fd);

          callback(err, url);
        });
      }

    });
  }
};
