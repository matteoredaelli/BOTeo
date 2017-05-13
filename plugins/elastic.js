"use strict";

var request = require("request"),
    config  = require("config");

exports.esSearch = function(index, type, query, callback) {
  var url = config.get('elastic.url') + "/" + index + "/" + type + "/_search";
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
