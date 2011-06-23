//var label = "Elapsed time";
//console.timeEnd(label);
//process.exit();
process.on('SIGTERM', function(){
    console.log('terminating');
    process.exit(1);
});

setTimeout(function(){
    console.log('sending SIGTERM to process %d', process.pid);
    process.kill(process.pid, 'SIGTERM');
}, 500);

setTimeout(function(){
    console.log('never called');
}, 1000);
