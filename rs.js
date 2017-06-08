// Run this with: `node server.js` or npm start

var config = require("config"),
    request = require("request");

var utils = require("./utils"),
    plugin_rest = require("./plugins/rest"),
    plugin_weather = require("./plugins/weather");

// This would just be require("rivescript") if not for running this
// example from within the RiveScript project.

var RiveScript = require("./lib/rivescript.js"),
    rs = new RiveScript({utf8: true
                        //, debug: true
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

rs.setSubroutine("biapis", function (rs, args)  {
  return new rs.Promise(function(resolve, reject) {
    const biapisUrl = config.get('biapis.url');
    const url = biapisUrl + "/" + args.join("/");
    const qs = {};
    plugin_rest.get(url, qs, function(error, data){
      console.log(data)
      if(error) {
        reject(error);
      } else {
        console.log(data);
        resolve(utils.arraylist2string(data));
      }
    });
  });
});


rs.setSubroutine("esSearch", function (rs, args)  {
  return new rs.Promise(function(resolve, reject) {
    const elasticUrl = config.get('elastic.url');
    const index = args.shift();
    const type = args.shift();
    const fields = args.shift().split(",");
    const query = args.join(' ');
    console.log(fields);
    const url = elasticUrl + "/" + index + "/" + type + "/_search";
    const qs = {
      q: query
    }
    plugin_rest.get(url, qs, function(error, data){
      console.log(data)
      if(error) {
        reject(error);
      } else {
        if (data && data.hits && data.hits.hits) {
          var newdata = data.hits.hits.map(function(x) {return  utils.subset(x["_source"], fields) });
          console.log(newdata);
          resolve(utils.arraylist2string(newdata));
        } else {
          resolve("none");
        }
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

rs.setSubroutine("watsonSearch", function (rs, args)  {
    //console.log(args);
    return new rs.Promise(function(resolve, reject) {
	const watsonUrl = config.get('watson.url');
	const index = args.shift();
	const query = args.join(' ');
	const url = watsonUrl + "/search_" + index + "/" + query;   
	const qs = {}
	console.log(url);
	plugin_rest.get(url, qs, function(error, data){
	    console.log(data)
	    if(error) {
          reject(error);
	    } else {
		resolve(utils.arraylist2string(data));
	    }
	});
    });
});

module.exports = rs;
