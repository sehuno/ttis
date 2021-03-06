/**
****************************************************************************
* Copyright 2017 IBM
*
*   AlchemyAPI in Node.js
*
*   By JeanCarl Bisson (@dothewww)
*   More info: https://ibm.biz/nodejs-alchemyapi
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
****************************************************************************
*/

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require("express");

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require("cfenv");

// create a new express server
var app = express();
var fs = require("fs");
var mustache = require("mustache");
var watson = require("watson-developer-cloud");
var templates = require("./lib/templates");

// serve the files out of ./public as our main files
app.use(express.static(__dirname + "/public"));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Insert application endpoints here

// start server on the specified port and binding host
app.listen(appEnv.port, "0.0.0.0", function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

app.get("/story", function (req, res) {
  var alchemyLanguage = new watson.AlchemyLanguageV1({
    api_key: "625a0419b0099799e68b69b6a898a1b699b6735c"
  });

  var features = [
    "entities",
    "keywords",
    "title",
    "authors",
    "taxonomy",
    "concepts",
    "relations",
    "pub-date",
    "doc-sentiment",
    "doc-emotion",
    "page-image",
    "feeds"
  ];

  var parameters = {
    extract: features.join(","),
    sentiment: 1,
    emotion: 1,
    maxRetrieve: 1,
    url: req.query.url
  };

  alchemyLanguage.combined(parameters, function (err, response) {
    if (err) {
      res.send(err);
    } else {
      if (req.query.format == "json") {
        res.send(response);
      } else {
        res.send(mustache.render(templates.story, response));
      }
    }
  });
});