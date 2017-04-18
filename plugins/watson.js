var request = require("request");

exports.watson_ws = function(ws, q, callback) {
  request.get({
    url: "http://bi.com/biapis/watson_explorer/" + ws + "/" + q,
    qs: {},
    json: true
  }, function(error, response) {
    if (response.statusCode !== 200) {
      callback.call(this, response.body);
    } else {
      callback.call(this, null, response.body);
    }
  });
};
