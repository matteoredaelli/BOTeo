var request = require("request");

// Configuration: get an API key from http://openweathermap.org/appid and
// put it in this variable.
const APPID = process.env.OPENWEATHERMAP_APPID || 'change me';

if (APPID === 'change me') {
  console.log('Error -- edit app.js and provide the APPID for Open Weathermap.'.bold.yellow);
}

exports.getWeather = function(location, callback) {
  request.get({
    url: "http://api.openweathermap.org/data/2.5/weather",
    qs: {
      q: location,
      APPID: APPID
    },
    json: true
  }, function(error, response) {
    if (response.statusCode !== 200) {
      callback.call(this, response.body);
    } else {
      callback.call(this, null, response.body);
    }
  });
};
