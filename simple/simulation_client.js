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
    io = require('socket.io'),
    fs = require("fs");  
    
var hub_url = "http://localhost:8000"

var data = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns="http://purl.org/rss/1.0/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:cc="http://web.resource.org/cc/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:admin="http://webns.net/mvcb/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel rdf:about="http://smob.rhizomatik.net/">
<title>SMOB Hub of</title>
<link>http://smob.rhizomatik.net/</link>
<atom:link rel="hub" href="http://pubsubhubbub.appspot.com/subscribe"/>
<description>SMOB Hub of</description>
<dc:creator/>
<dc:date>2011-04-27T14:31:16+02:00</dc:date>
<admin:generatorAgent rdf:resource="http://smob.me/#smob?v=2.2"/>
<items>
<rdf:Seq>
<rdf:li rdf:resource="http://smob.rhizomatik.net/post/2011-05-25T23:33:56+02:00"/>
<item rdf:about="http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00">
<title>publisher112</title>
<link>
http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00
</link>
<description>publisher112</description>
<dc:creator/>
<dc:date>2011-04-27T14:26:46+02:00</dc:date>
<content:encoded>
<![CDATA[
<http://smob.rhizomatik.net/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://smob.me/ns#Hub> . <http://sws.geonames.org/2964180/> <http://www.w3.org/2000/01/rdf-schema#label> "Galway city, Ireland (seat of a second-order administrative division)"^^<http://www.w3.org/2001/XMLSchema#string>
]]>
<![CDATA[
. <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://rdfs.org/sioc/types#MicroblogPost> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00> <http://rdfs.org/sioc/ns#has_container> <http://smob.rhizomatik.net/> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00> <http://rdfs.org/sioc/ns#has_creator> <http://smob.rhizomatik.net/me> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00> <http://xmlns.com/foaf/0.1/maker> <http://smob.rhizomatik.net/me#id> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00> <http://purl.org/dc/terms/created> "2011-04-27T14:26:46+02:00"^^<http://www.w3.org/2001/XMLSchema#dateTime> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00> <http://purl.org/dc/terms/title> "Update - 2011-04-27T14:26:46+02:00"^^<http://www.w3.org/2001/XMLSchema#string> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00> <http://rdfs.org/sioc/ns#content> "publisher112"^^<http://www.w3.org/2001/XMLSchema#string> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00#presence> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://online-presence.net/opo/ns#OnlinePresence> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00#presence> <http://online-presence.net/opo/ns#declaredOn> <http://smob.rhizomatik.net/me> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00#presence> <http://online-presence.net/opo/ns#declaredBy> <http://smob.rhizomatik.net/me#id> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00#presence> <http://online-presence.net/opo/ns#StartTime> "2011-04-27T14:26:46+02:00"^^<http://www.w3.org/2001/XMLSchema#dateTime> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00#presence> <http://online-presence.net/opo/ns#customMessage> <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00> . <http://smob.rhizomatik.net/post/2011-04-27T14:26:46+02:00#presence> <http://online-presence.net/opo/ns#currentLocation> <http://sws.geonames.org/2964180/> .
]]>
</content:encoded>
</item>'

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
//create_publish_data();
publish(hub_url, "publish", "/rss/"+clientid+, data, function() {
  //open("");
  //write()
  var filename = path.join(process.cwd(), "/"+clientid+);  
  fs.open(filename, "w+", function(err, file) {
    fs.write(file, "Sent in time ", (err, written) {
      if(err) {  
          return;  
      }    
    });
});


web_server.addListener("listening", function() {
  var hostInfo = "localhost"+ ":" + "8081";
  log("Listening to HTTP connections on http://" + hostInfo);
});
