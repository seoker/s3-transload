## s3-transload

A module that pipe network file into AWS S3.

### What this module do?

* GET a file from the provide url and stream to S3


## Example

```js
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
  apiVersion: '2006-03-01'
});
const s3Transload = require('s3-transload')(s3);

//url to get the resource
var getUrl = "http://path/to/the/resource";

s3Transload.urlToS3(getUrl, 'your-bucket-name', 'your-item-key', function(error, data) {
  if (error) return console.log(error);
  console.log("The resource URL on S3 is:", data);
});
```

s3 object is an optional parameter, so you're able to create an `s3-transload` like this:
```js
const s3Transload = require('s3-transload')();
```

## Note

[How To setup AWS credential](https://aws.amazon.com/sdk-for-node-js/)

## Under the hood

* It use [request](https://github.com/request/request) to create stream, and pipe it into s3 upload.
* It will stop and return error if HTTP status code not equal to 200.
* This module is inspire by this [SO](http://stackoverflow.com/a/37366093/3744557) and this [SO](http://stackoverflow.com/a/26163128/3744557)
