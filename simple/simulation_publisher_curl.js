var util = require('util');
var exec = require('child_process').exec;

var command = 'curl -s -X POST http://localhost:8080/ -d hub.mode=publish\&\hub.url=http://localhost:8081/1/rss -w "%{http_code} %{time_total}\\n"  -o /dev/null'

child = exec(command, function(error, stdout, stderr){

	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);

	if(error !== null)
	{
		console.log('exec error: ' + error);
	}

});
