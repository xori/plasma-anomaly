var google = require('./lib/googledrive'),
    http = require('http'),
    fs = require('fs')


var server = http.createServer(function(req, res) {
  if(req.url == '/favicon.ico') {
    res.statusCode = 404;
    res.end();
    return;
  }else if(req.url == '/test') {
    res.end(fs.readFileSync('./tests/test.html'));
    return;
  }else if (req.url == '/include.js') {
    res.end(fs.readFileSync('./include.js'));
    return;
  }

  google.get(req.url.split('/')[1], function(stream){
    if(stream != null) {
      stream.pipe(res);
      console.log("[LOG] Streaming Document");
    } else {
      res.statusCode = 404;
      res.end();
      return;
    }
  });
});

server.listen(8000)

console.log('Server up on 8000');
