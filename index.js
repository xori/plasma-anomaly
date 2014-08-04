var google = require('./api/googledrive'),
    http = require('http');


var server = http.createServer(function(req, res) {
  if(req.url == '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  }

  google.get(req.url.split('/')[1], function(stream){
    stream.pipe(res);
    console.log("[LOG] Streaming Document");
  });
});

server.listen(8000)

console.log('Server up on 8000');
