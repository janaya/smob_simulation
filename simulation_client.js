var fs = require("fs"),
    express = require("express"),
    sys = require("sys"),
    http = require("http"),
    querystring = require("querystring"),
    url = require("url"),
    base64 = require("./deps/base64"),
    //ws = require('./deps/node-websocket-server/lib/ws'),
    //uuid = require('uuid-pure').newId,
    Crypto = require('crypto'),
    io = require('socket.io');
    
var hub_url = "http://localhost:8000"

/////////////////////////////////////////////////////
// functions
var publish = function(hub_url, mode, topic, data, callback, errback) {
  var params = {
    "hub.mode"      : mode,
    "hub.topic"     : topic
  };
  
  var body = querystring.stringify(params)
      hub = url.parse(hub_url),
      contentLength = body.length,
      headers = {
        "Accept": '*/*',
//        "Authorization": "Basic "+ base64.encode(config.pubsubhubbub.username + ":" + config.pubsubhubbub.password),
        "Content-Length": contentLength,
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": hub.hostname,
        "User-Agent": "Socket-Sub for Node.js",
        "Connection": "close"
      };
  var client  = http.createClient(hub.port || 80, hub.hostname );
  var request = client.request("POST", hub.pathname + (hub.search || ""), headers);
//  var request = client.request("POST","/subscribe", headers);
  request.write(body, 'utf8');

  request.addListener("response", function(response) {
    var body = "";
    response.addListener("data", function(chunk) {
        body += chunk;
    });
    response.addListener('end', function() {
      if(response.statusCode == (202 || 204)) {
        callback();
      }
      else {
        errback(body);
        log(body);
      }
    });
  });
  request.end(); // Actually Perform the request
}

var create_publish_data = function(callback, errback) {

});

var web_server = express.createServer(
  express.bodyParser()
);

//without PPO
//===========
//A. 
//  1 Publisher POST
//  Hub receives 1 POST
//  Hub POST 1 feed to n Subscribers
//  1000 Subscribers receive

//B. 
//  1000 Publishers POST
//  Hub receives 1000 POSTS
//  Hub POST 1000 feeds to 1 Subscriber
//  1 Subscriber receives
  

//with PPO
//========
//1. create 1000 subscribers profiles batch and upload them to the hub triple store
//2. subscribe 1000 clients
//3. create 1000 posts batch

//4. client POST random posts(from posts batch) in a random time period
//4. client is always listening and ramdomly arrives posts POST

//initialize a client id
var clientid = 

// RECEIVE posts
web_server.post("/"+clientid+"/callback", function(req, res) {
    if (req.headers['content-type'] == "application/x-www-form-urlencoded") {
      params = req.body;
    } else {
      params = req.query;
    }
    var topic_url = params['hub.topic'] || null;
    var mode = params['hub.mode'] || null;
    
    if (topic_url && (mode == "publish")) {
        req.on('data', function(data) {
          //here the post should be stored in the local repository
          //and update the user interface
          
          res.send("Thanks", 200);
          // get time
          // open("/results/"+"clientid+"-received.txt", "w");
          // write(time="\n");
          //for simulation, write data to the hd?
          // "client "+clientid+"received post"+x
        )};
    }
});

// SEND posts
create_publish_data();
publish(hub_url, "publish", "/rss/"+clientid+, data, callback, errback);


web_server.addListener("listening", function() {
  var hostInfo = "localhost"+ ":" + "8081";
  log("Listening to HTTP connections on http://" + hostInfo);
});
