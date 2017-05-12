"use strict";

var request = require("request");

exports.esSearch = function(type, query, callback) {
  var url = "http://localhost/grafo/" + type + "/_search";
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
