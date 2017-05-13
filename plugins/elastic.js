"use strict";

var request = require("request");

exports.esSearch = function(baseurl, index, type, query, callback) {
  var url = baseurl + "/" + index + "/" + type + "/_search";
  console.log(url);
  console.log(query);
  request.get({
    url: url,
    qs: {
      q: query
    },json: true
  }, function(error, response) {
    if (response.statusCode !== 200) {
      callback.call(this, error);
    } else {
      callback.call(this, null, response.body.hits.hits);
    }
  });
};
