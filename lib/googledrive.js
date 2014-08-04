var google = require('googleapis');
var drive = google.drive('v2');
var fs = require('fs'),
    readline = require('readline'),
    http = require('http'),
    https= require('https'),
    Url = require('url'),
    Stream = require('stream');

var PREFERENCE_LOCATION = "./secret.json";
var preferences = JSON.parse(fs.readFileSync(PREFERENCE_LOCATION));
var CLIENT_ID = preferences.client_id,
    CLIENT_SECRET = preferences.client_secret,
    REDIRECT_URL = preferences.redirect_uris,
    SCOPE = 'https://www.googleapis.com/auth/drive';

var auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// Get Access Code
// BEGIN
if(!preferences.credz) {
  var url = auth.generateAuthUrl({
    scope: SCOPE
  });
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  var getAccessToken = function(code) {
    auth.getToken(code, function(err, tokens) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      preferences.credz = auth.credentials = tokens;
      console.log("Saving Access Token...")
      fs.writeFileSync(PREFERENCE_LOCATION, JSON.stringify(preferences,null,'  '));
      rl.close();
    });
  };
  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', getAccessToken);
} else {
  auth.setCredentials(preferences.credz)
  console.log("Detected Access Token.")
}
// Get Access Code
// END

// Export API Code
function aGet(uri) {
  var request = Url.parse(uri);
  request.headers = {
    'Authorization': 'Bearer ' + auth.credentials.access_token
  }
  request.method = "GET"
  var bits = new Stream.PassThrough();
  https.request(request, function(res) {
    console.error("[LOG] Fetching Document", res.statusCode)
    res.pipe(bits);
  }).on('error', function(err) {
    console.error("[ERROR]",err);
  }).end();
  return bits;
}

/**
 * docID = "asdfad"
 * callback = function(err, document)
 *
 * return Request object.
 */
exports.get = function(docID, callback) {
  return drive.files.get({
    fileId: docID,
    auth: auth
  }, function(err, document) {
    if(err) {
      console.error("Document", docID, "does not exist.");
      return err;
    }
    console.log("[LOG] Found Document", docID);
    var url = document.exportLinks['text/html'];
    callback(aGet(url));
  });
}
