// Run this with: `node server.js` or npm start

var request = require("request");

var utils = require("./utils"),
    plugin_elastic = require("./plugins/elastic"),
    plugin_watson = require("./plugins/watson"),
    plugin_weather = require("./plugins/weather");

// This would just be require("rivescript") if not for running this
// example from within the RiveScript project.

var RiveScript = require("./lib/rivescript.js"),
    rs = new RiveScript({utf8: true
                        // , debug: true
                        });

var mytest = function(location, callback) {
      callback.call(this, null, location + " parsed");
};


rs.setSubroutine("mytest", function (rs, args)  {
  return new rs.Promise(function(resolve, reject) {
    mytest(args.join(' '), function(error, data){
      if(error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
})

rs.setSubroutine("esSearch", function (rs, args)  {
  return new rs.Promise(function(resolve, reject) {
    var type = args.shift();
    //var fields = args.shift().split(",");
    //console.log(fields);
    plugin_elastic.esSearch(type, args.join(' '), function(error, data){
      console.log(data)
      if(error) {
        reject(error);
      } else {
        var newdata = data.map(function(x) {return x["_source"]});
        //console.log(newdata);
        // should be done for each eleemnt of list: var subset = fields.reduce(function(o, k) { o[k] = newdata[k]; return o; }, {});
        resolve(utils.arraylist2string(newdata));
      }
    });
  });
});

rs.setSubroutine("getWeather", function (rs, args)  {
  return new rs.Promise(function(resolve, reject) {
    plugin_weather.getWeather(args.join(' '), function(error, data){
      if(error) {
        reject(error);
      } else {
        resolve(data.weather[0].description);
      }
    });
  });
});

rs.setSubroutine("checkForRain", function(rs, args) {
  return new rs.Promise(function(resolve, reject) {
    getWeather(args.join(' '), function(error, data){
      if(error) {
        console.error('');
        reject(error);
      } else {
        var rainStatus = data.rain ? 'yup :(' : 'nope';
        resolve(rainStatus);
      }
    });
  });
});

module.exports = rs;
