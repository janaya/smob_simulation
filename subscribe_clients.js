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

var web_server = express.createServer(
  express.bodyParser()
);


// HTTP GET REQUEST TO callback_url
// (subscription verification)

//web_server.get(
//  config.pubsubhubbub.callback_url_path + ':feed_id', 
//log("callback url: "+config.pubsubhubbub.callback_url_path + ':feed_id');
web_server.get(
  "/callback", 
  function(req, res) {
    log("HTTP GET REQUEST TO callback_url");
    log("req.headers['user-agent']"+req.headers['user-agent']);
    log("req.headers['server']"+req.headers['server']);
    
    //when content-type: application/x-www-form-urlencoded;
    if (req.headers['content-type'] == "application/x-www-form-urlencoded") {
      log("www-form-urlencoded");
      //params = req.body;
    } else {
      log("no www-form-urlencoded");
      //params = req.query;
    }
    params = req.body || req.query || req.params;
    log(sys.inspect(req.body));
    log(sys.inspect(req.query));
    log(sys.inspect(req.params));
    log(sys.inspect(params));
    var topic_url = params['hub.topic'] || null;
    var mode = params['hub.mode'] || null;
    var challenge = params['hub.challenge'] || null;
    
      if (mode == "subscribe") {
            
            // HTTP RESPONSE TO hub_url with challenge
            res.send(challenge, 200);
      }
)};


// ask for subscription


web_server.addListener("listening", function() {
  var hostInfo = "localhost"+ ":" + "8081";
  log("Listening to HTTP connections on http://" + hostInfo);
});
