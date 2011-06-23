var fs = require("fs"),
    express = require("express"),
    sys = require("sys"),
    http = require("http"),
    querystring = require("querystring"),
    url = require("url"),
    Crypto = require('crypto'),
    fs = require("fs");  
var util = require('util');
var exec = require('child_process').exec;
var hub_url = "http://localhost:8080";
var topic_url = "http://localhost:8081"+"/rss/"+process.argv[2];
var listenhost = "localhost";
var listenport = 8081;
var label = "Elapsed time";

var debug = true;

var log = function(message) {
  if(debug) {
    sys.puts(message);
  }
};

/////////////////////////////////////////////////////
// functions


var publish = function(hub_url, mode, topic, callback, errback) {
  var params = {
    "hub.mode"      : mode,
    "hub.url"     : topic
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
  
  //console.time(label);
  request.end(); // Actually Perform the request
}

var create_publish_data = function(callback, errback) {

};

var web_server = express.createServer(
  express.bodyParser(),
  express.profiler()
//  express.static('/rss',__dirname + '/rss')
);


//create_publish_data();

web_server.get("/rss/:client_id",  function(req, res) {
  log("get");
  fs.readFile("./rss/feed"+req.params.client_id+".rss","utf8", function(err, data) {
    if (err) {
      log("err");
    }
    log(data);
    res.send(data);
    //console.timeEnd(label);
    //process.exit();
  });
});

////web_server.get('/:client_id/rss/*', function(file){ 
//web_server.get('/rss/*', function(file){ 
//  log("get");
//  //this.sendfile(options.path + '/' + file) 
//  this.render("feed.rss", { layout: false }); 
//})

web_server.addListener("listening", function() {
  var hostInfo = listenhost+ ":" + listenport;
  log("Listening to HTTP connections on http://" + hostInfo);
});
web_server.listen(listenport, listenhost);


// SEND posts
publish(hub_url, "publish", topic_url,  function() {
  log("send topic");
  }, function(error) {    
});

