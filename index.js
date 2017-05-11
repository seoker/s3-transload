var AWS = require('aws-sdk');
var request = require('request');
const stream = require('stream');

function uploadToS3(s3, params, cb) {
  var pass = new stream.PassThrough();

  s3.upload(Object.assign({}, params, { Body: pass }))
    .send(function(err, data) {
      if (err) {
        cb(err, data);
      }
      if (data && data.Location) {
        cb(null, data.Location); // data.Location is the uploaded location
      } else {
        cb(new Error("data.Location not found!"), data);
      }
    });
  return pass;
}
;

module.exports = function(s3) {
  s3 = s3 || new AWS.S3({
    apiVersion: '2006-03-01'
  });

  return {
    urlToS3: function(url, params, callback) {
      var req = request.get(url);
      req.pause();
      req.on('response', function(resp) {
        if (resp.statusCode == 200) {
          if (resp.headers['content-type']) {
            params.ContentType = resp.headers['content-type'];
          }
          if (resp.headers['content-encoding']) {
            params.ContentEncoding = resp.headers['content-encoding'];
          }
            
          req.pipe(uploadToS3(s3, params, callback));
          req.resume();
        } else {
          callback(new Error('request item did not respond with HTTP 200'));
        }
      });
    }
  };
};

