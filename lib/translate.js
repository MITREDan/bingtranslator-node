// Copyright (c) Matthew Podwysocki. All rights reserved. See License.txt in the project root for license information.

var http = require('http');
var getAdmToken = require('./getAdmToken');

function translate(credentials, text, from, to, httpOptions, cb) {
  var detectOptions = {
    hostname: 'api.microsofttranslator.com',
    port: 80,
    path: '/v2/Ajax.svc/Translate?text='
      + encodeURIComponent(text) + '&from='
      + encodeURIComponent(from) + '&to='
      + encodeURIComponent(to),
    method: 'GET'
  };


  // incorporate user's http options into http options object
  for (var attrname in httpOptions) { detectOptions[attrname] = httpOptions[attrname]; }


  getAdmToken(credentials, function (err, result) {
    if (err) {
      cb(err);
      return;
    }

    var req = http.request(detectOptions, function (res) {

      res.setEncoding('utf8');

      var data = '';
      res.on('data', function (d) {
        data += d;
      });

      res.on('error', function (err) {
        cb(err);
      });

      res.on('end', function () {
        // Strip out JSONP header and quotes
        cb(null, data.substring(2, data.length - 1));
      });
    });

    req.setHeader('Authorization', 'Bearer ' + result.access_token);
    req.end();
  });
}

module.exports = translate;
