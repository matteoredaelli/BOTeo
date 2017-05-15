"use strict";

var request = require("request");

exports.get = function(url, qs, callback) {
  console.log(url);
  request.get({
    url: url,
    qs: qs,
    json: true
  }, function(error, response) {
    if (response.statusCode !== 200) {
      callback.call(this, error);
    } else {
      callback.call(this, null, response.body.hits.hits);
    }
  });
};
