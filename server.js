// Run this with: `node server.js` or npm start

"use strict";

var readline = require("readline");
var colors = require('colors');
var rs = require("./rs");

// This would just be require("rivescript") if not for running this
// example from within the RiveScript project.

var express = require("express"),
    cookieParser = require('cookie-parser'),
    bodyParser = require("body-parser");

// Create a prototypical class for our own chatbot.
var AsyncBot = function(onReady) {
    var self = this;

    // Load the replies and process them.
    rs.loadDirectory("./eg/brain", function() {
	rs.sortReplies();
	onReady();
    });
    
    // This is a function for delivering the message to a user. Its actual
    // implementation could vary; for example if you were writing an IRC chatbot
    // this message could deliver a private message to a target username.
    self.sendMessage = function(username, message) {
      // This just logs it to the console like "[Bot] @username: message"
      console.log(
        ["[Brick Tamland]", message].join(": ").underline.green
      );
    };

    // This is a function for a user requesting a reply. It just proxies through
    // to RiveScript.
    self.getReply = function(username, message, callback) {
      return rs.replyAsync(username, message, self).then(function(reply){
        callback.call(this, null, reply);
      }).catch(function(error) {
        callback.call(this, error);
      });
    }
};

var guest = 0;

// Create and run the example bot.
var bot = new AsyncBot(function() {

    // Set up the Express app.
    var app = express();

    app.use(cookieParser());
    app.use('/BOTeo/public', express.static('public'))
    // Parse application/json inputs.
    app.use(bodyParser.json());
    app.set("json spaces", 4);

    // Set up routes.
    app.post("/BOTeo/reply", getReply);
    app.get("/", showUsage);
    //app.get("*", showUsage);

    // Start listening.
    app.listen(2001, function() {
	console.log("Listening on http://localhost:2001");
    });
});

// POST to /reply to get a RiveScript reply.
function getReply(req, res) {
    // Get data from the JSON post.
    var message  = req.body.message;
    var vars     = req.body.vars;
    var username = req.body.username;

    if (req.cookies.username) {
	username = req.cookies.username;
    } else {
	username = "guest" + guest++;
	
	console.log(username);
	res.cookie('username', username, { maxAge: 100000 * 60 });
    }

    /*
    if (username == undefined) {
       username = "guest" + guest++;
    };
    */
    
    console.log(username);
    // Make sure username and message are included.
    if (typeof(message) === "undefined") {
		return error(res, "message is a required key");
    }
    
    // Copy any user vars from the post into RiveScript.
    if (typeof(vars) !== "undefined") {
	for (var key in vars) {
	    if (vars.hasOwnProperty(key)) {
		rs.setUservar(username, key, vars[key]);
	    }
	}
	rs.setUservar(username, "username", username);
    }

    var reply = bot.getReply(username, message, function(error, reply){
        if (error) {
            res.json({
		"status": "ko",
		"reply": error,
		"vars": vars
	    });
        } else {
	    // Get all the user's vars back out of the bot to include in the response.
	    vars = rs.getUservars(username);
	    
	    // Send the JSON response.
	    res.json({
		"status": "ok",
		"reply": reply,
		"vars": vars
	    });
        }
    });
	   
};

// All other routes shows the usage to test the /reply route.
function showUsage(req, res) {
	var egPayload = {
		"username": "soandso",
		"message": "Hello bot",
		"vars": {
			"name": "Soandso"
		}
	};
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.write("Usage: curl -i \\\n");
	res.write("   -H \"Content-Type: application/json\" \\\n");
	res.write("   -X POST -d '" + JSON.stringify(egPayload) + "' \\\n");
	res.write("   http://localhost:2001/BOTeo/reply");
	res.end();
}

// Send a JSON error to the browser.
function error(res, message) {
	res.json({
		"status": "error",
		"message": message
	});
}


