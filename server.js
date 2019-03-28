var express = require('express');
var request = require('request');
var jsonxml = require('jsontoxml');
var app = express();

app.get('/', function(req, res) {
    request.get({ url: "http://api.wbur.org/events", json: "true" }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var wellFormed = {};
            for (var i = 0; i < body.body.length; ++i) {
                delete body.body[i].taxonomy;
                var thisBody = body.body[i];
                wellFormed[jsonxml.escape(thisBody.id)] = {
                  'title': jsonxml.escape(thisBody.headline),
                  'content': jsonxml.escape(thisBody.content + '\n\n Get tickets here: ' + thisBody.ticketURL),
                  'startTime': jsonxml.escape(thisBody.start),
                  'endTime': jsonxml.escape(thisBody.end),
                  'location': jsonxml.escape(thisBody.venue)
                }
            }
            var finalJson = [{
                name: 'rss',
                attrs: { version:'2.0' },
                children: [ wellFormed ]
            }];
            var xmlOptions = {
              'prettyPrint': true,
              'removeIllegalNameCharacters': true,
              'xmlHeader': true
            };
            res.set('Content-Type', 'application/xml');
            res.send(jsonxml(finalJson, xmlOptions));

        }
    });
});

app.set('port', process.env.PORT || 8000);
app.listen(app.get('port'));
console.log("The server is now running on port " + app.get('port'));
