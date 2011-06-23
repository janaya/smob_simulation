var fs = require("fs"),
    express = require("express"),
    sys = require("sys"),
    http = require("http"),
    querystring = require("querystring"),
    url = require("url"),
    Crypto = require('crypto');
    
var hub_url = "http://localhost:8080";
var callback_url = "http://localhost:8082/callback/"+process.argv[2];
var listenhost = "localhost";
var listenport = 8080 + parseInt(process.argv[2]);
var label = "Elapsed time";
var topic_url = "http://localhost:8081"+"/rss/"+"1";
var debug = true;

var log = function(message) {
  if(debug) {
    sys.puts(message);
  }
};

var subscribe = function(hub_url, mode, callback_url, topic, callback, errback) {
  var params = {
    "hub.mode"      : mode,
    "hub.topic"     : topic,
    "hub.verify"    : "async",
    "hub.callback"  : callback_url
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
  log("subscribing "+callback_url+" to "+topic_url);
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

var web_server = express.createServer(
  express.bodyParser(),
  express.profiler()
);


// RECEIVE posts
web_server.post("/callback"+':client_id',  function(req, res) {
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
          log("received post");
          res.send("Thanks", 200);
          // get time
          // open("/results/"+"clientid+"-received.txt", "w");
          // write(time="\n");
          //for simulation, write data to the hd?
          // "client "+clientid+"received post"+x
        });
    }
});

// HTTP GET REQUEST TO callback_url
// (subscription verification)

web_server.get("/callback/"+':client_id', 
  function(req, res) {
    log("HTTP GET REQUEST TO callback_url");
    
    //when content-type: application/x-www-form-urlencoded;
    if (req.headers['content-type'] == "application/x-www-form-urlencoded") {
      log("www-form-urlencoded");
      //params = req.body;
    } else {
      log("no www-form-urlencoded");
      //params = req.query;
    };
    params = req.query;
    log("body"+sys.inspect(req.body));
    log(sys.inspect(req.query));
    log(sys.inspect(req.params));
    log(sys.inspect(params));
    var topic_url = params['hub.topic'] || null;
    var mode = params['hub.mode'] || null;
    var challenge = params['hub.challenge'] || null;
    
    if (mode == "subscribe") {
          // HTTP RESPONSE TO hub_url with challenge
          res.send(challenge, 200);
          log("subscribed "+req.params.client_id);
          //console.timeEnd(label);
          //receiver.close()
          //process.exit();
          //process.kill(process.pid, 'SIGTERM');
    };
});

web_server.addListener("listening", function() {
  var hostInfo = listenhost+ ":" + listenport;
  log("Listening to HTTP connections on http://" + hostInfo);
});
web_server.listen(listenport, listenhost);

// ask for subscription
subscribe(hub_url, "subscribe", callback_url, topic_url, function() {
  //console.time(label);
  }, function(error) {  
  });
