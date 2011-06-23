import urllib2
from urllib2 import HTTPError

#feed_url = 'http://smob.rhizomatik.net/rss/me'
#req = urllib2.Request(feed_url)
#response = urllib2.urlopen(req)
##response = urllib2.urlopen(feed_url)
#feed = response.read()
#print feed

# SUBSCRIBER
f = open('../../workdoc/smob-feed-example.rss')
feed = f.read()
f.close()
subscriber = 'http://smob2.rhizomatik.net/callback'
request = urllib2.Request(subscriber,feed)
#request.add_header("Content-Type", "text/xml")
request.add_header("Content-Type", "application/rdf+xml")
response = urllib2.urlopen(request)
the_page = response.read()
response.close()
print the_page

data = """
INSERT INTO <http://smob.rhizomatik.net/data/2011-03-29T19:02:23+02:00> {
<http://smob.rhizomatik.net/post/2011-03-29T19:02:23+02:00> a sioct:MicroblogPost ;
sioc:has_container <http://smob.rhizomatik.net/> ;
sioc:has_creator <http://smob.rhizomatik.net/me> ;
foaf:maker <http://smob.rhizomatik.net/me#id> ;
dct:created "2011-03-29T19:02:23+02:00"^^xsd:dateTime ;
dct:title "Update - 2011-03-29T19:02:23+02:00"^^xsd:string ;
sioc:content "publisher27"^^xsd:string .
<http://smob.rhizomatik.net/> a smob:Hub .
<http://smob.rhizomatik.net/post/2011-03-29T19:02:23+02:00#presence> a opo:OnlinePresence ;
opo:declaredOn <http://smob.rhizomatik.net/me> ;
opo:declaredBy <http://smob.rhizomatik.net/me#id> ;
opo:StartTime "2011-03-29T19:02:23+02:00"^^xsd:dateTime ;
opo:customMessage <http://smob.rhizomatik.net/post/2011-03-29T19:02:23+02:00> .} 
"""

#PUBLISHER
hub_url = 'http://pubsubhubbub.appspot.com/publish'
topic_url = 'http://smob.rhizomatik.net/me/rss'
post_string = "hub.mode=publish&hub.url=".urlencode(topic_url)

####
item = """
<item rdf:about="http://smob.rhizomatik.net/post/2011-03-29T19:02:23+02:00"> 
	<title>publisher27</title> 
	<link>http://smob.rhizomatik.net/post/2011-03-29T19:02:23+02:00</link> 
	<description>publisher27</description> 
	<dc:creator></dc:creator> 
	<dc:date>2011-03-29T19:02:23+02:00</dc:date> 
	<content:encoded><![CDATA[publisher27]]></content:encoded> 
</item> 
"""

query = """
CONSTRUCT { ?s ?p ?o . }
WHERE {
  GRAPH ?g { ?s ?p ?o . }
}
"""

query = "CONSTRUCT { ?s ?p ?o . } WHERE { GRAPH ?g { ?s ?p ?o . }}"

query_values = {
    'query': query
}

topic_url = 'http://smob.rhizomatik.net/sparql'

values = {
    'hub.mode': 'publish',
    'hub_url': topic_url
}

data = urllib.urlencode(values)+'?'+urllib.urlencode(query_values)


values = {
    'hub.mode': 'publish',
    'hub_url': topic_url+'?'+urllib.urlencode(query_values)
}

 'hub_url=http%3A%2F%2Fsmob.rhizomatik.net%2Fsparql%3Fquery%3D%250ACONSTRUCT%2B%257B%2B%253Fs%2B%253Fp%2B%253Fo%2B.%2B%257D%250AWHERE%2B%257B%250A%2B%2BGRAPH%2B%253Fg%2B%257B%2B%253Fs%2B%253Fp%2B%253Fo%2B.%2B%257D%250A%257D%250A&hub.mode=publish'

%2Fsmob.rhizomatik.net%2Fsparql%3Fquery%3D%250ACONSTRUCT%2B%257B%2B%253Fs%2B%253Fp%2B%253Fo%2B.%2B%257D%250AWHERE%2B%257B%250A%2B%2BGRAPH%2B%253Fg%2B%257B%2B%253Fs%2B%253Fp%2B%253Fo%2B.%2B%257D%250A%257D%250A

 
post_string = "hub.mode=publish&hub.url="+urllib.urlencode(topic_url)+'?'+urllib.urlencode(query_values)

### PUBLISHER
hub_url = 'http://pubsubhubbub.appspot.com/publish'
topic_url = 'http://smob.rhizomatik.net/sparql'

values = {
    'hub.mode': 'publish',
    'hub_url': topic_url
}
data = urllib.urlencode(values)
request = urllib2.Request(hub_url)
request.add_header("Content-Type", "application/x-www-form-urlencoded")
request.add_data(data)
try:
    result = urllib2.urlopen(request)
except HTTPError, e:
    print e
    print e.code
    err = e.read()
    print err
    if e.code == 409:
        print "duplicate!!"
else:
    output = result.read()
    result.close()
    print output
    
### GET PUBLISHER TOPIC

hub_url = "http://smob.rhizomatik.net/sparql?query%3D%250ACONSTRUCT%2B%257B%2B%253Fs%2B%253Fp%2B%253Fo%2B.%2B%257D%250AWHERE%2B%257B%250A%2B%2BGRAPH%2B%253Fg%2B%257B%2B%253Fs%2B%253Fp%2B%253Fo%2B.%2B%257D%250A%257D%250A"

hub_url = "http://smob.rhizomatik.net/sparql?query%3D%250ACONSTRUCT%2B%257B%2B%253Fs%2B%253Fp%2B%253Fo%2B.%2B%257D%250AWHERE%2B%257B%250A%2B%2BGRAPH%2B%253Fg%2B%257B%2B%253Fs%2B%253Fp%2B%253Fo%2B.%2B%257D%250A%257D%250A&output=rdfxml"

request = urllib2.Request(hub_url)
acceptHeader = "application/rdf+xml"
request.add_header("Accept", acceptHeader)
try:
    result = urllib2.urlopen(request)
except HTTPError, e:
    print e
    print e.code
    err = e.read()
    print err
    if e.code == 409:
        print "duplicate!!"
else:
    output = result.read()
    result.close()
    print output

<rdf:Description rdf:about="http://smob.rhizomatik.net/">
<rdf:type rdf:resource="http://smob.me/ns#Hub"/>
</rdf:Description>


curl -g 'http://smob.rhizomatik.net/sparql?query=CONSTRUCT+{+%3Fs+%3Fp+%3Fo+.+}+WHERE+{+GRAPH+%3Fg+{+%3Fs+%3Fp+%3Fo+.+}}'

curl -X POST http://superfeedr.com/hubbub -d'hub.mode=subscribe' -d'hub.topic=http://en.gravatar.com/b30ce50678f0e934eaa6697425c59dd7.json' -d'hub.callback=<your_callback_url>' -D- -u'sf_login:sf_password'

curl -X POST http://pubsubhubbub.appspot.com/publish -d'hub.mode=publish' -d'hub.url=http://smob.rhizomatik.net/sparql?query=CONSTRUCT+{+%3Fs+%3Fp+%3Fo+.+}+WHERE+{+GRAPH+%3Fg+{+%3Fs+%3Fp+%3Fo+.+}}'

curl -X POST http://pubsubhubbub.appspot.com/publish -d'hub.mode=publish' -d'hub.url=http://smob.rhizomatik.net/sparql?query=CONSTRUCT{?s ?p ?o .}WHERE{GRAPH ?g{?s ?p ?o .}}'

curl -X POST http://pubsubhubbub.appspot.com/publish -d'hub.mode=publish' -d'hub.url=http://smob.rhizomatik.net/rdf' -D-

http://smob.rhizomatik.net/sparql?query=CONSTRUCT+{+%3Fs+%3Fp+%3Fo+.+}%0D%0AWHERE+{%0D%0A++GRAPH+%3Fg+{+%3Fs+%3Fp+%3Fo+.+}%0D%0A}&output=&jsonp=&key=
http://smob.rhizomatik.net/sparql?query=CONSTRUCT+{+%3Fs+%3Fp+%3Fo+.+}%0D%0AWHERE+{%0D%0A++GRAPH+%3Fg+{+%3Fs+%3Fp+%3Fo+.+}%0D%0A}&output=rdfxml&jsonp=&key=
http://smob.rhizomatik.net/sparql?query=CONSTRUCT+{+%3Fs+%3Fp+%3Fo+.+}+WHERE+{+GRAPH+%3Fg+{+%3Fs+%3Fp+%3Fo+.+}}&output=rdfxml&jsonp=&key=


#### POST
values = {
    'id':'40503',
    'title':'Aaa'
}

data = simplejson.dumps(values, ensure_ascii=False)


request = urllib2.Request(url)
request.add_header("Content-Type", "application/json")
acceptHeader = "application/json"
request.add_header("Accept", acceptHeader)
request.add_header("Authorization", auth)
request.add_data(data)


try:
    result = urllib2.urlopen(request)
except HTTPError, e:
    print e
    print e.code
    output = e.read()
    print output
else:
    output = result.read()
    result.close()
    print output
