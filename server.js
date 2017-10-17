const express = require("express");
const mongojs = require("mongojs");
const request = require("request");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4100;

var databaseURL = "scraper";
var collections = ["scrapedData"];

var db = mongojs.apply(databaseURL, collections);
db.on("error", function (error) {
    console.log("database error:", error);
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.get("/", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything,
    // but this time, sort it by name (1 means ascending order)
    db.scrapedData.find(function(error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });

  app.get("/scrape", function(req,res) {
    db.scrapedData.remove({});
    request("https://orlando.craigslist.org/d/pets/search/pet", function (error, response, html) {
        var $ = cheerio.load(html);
        $("a.result-title").each(function (i, element) {
    
          var link = $(element).attr("href");
          var title = $(element).text();
    
         db.scrapedData.insert({ title: title, link: link });
        });
        res.send("scrape complete");
      });
  });


// grab the files that have the routes and logic
// app.get("/", function (req, res) {
//     var main = require("./routes/api/index.js");
//     main(app, __dirname);
//     // res.send("hello");
// });
// app.get("/scrape", function (req, res) {
//     var fetch = require("./routes/api/fetch.js");
//     fetch(app, __dirname);
//     res.redirect("/");
// });

// var headlines = require("./routes/api/headlines.js");
// headlines(app, __dirname);

// var notes = require("./routes/api/notes.js");
// notes(app, __dirname);


app.listen(PORT, function () {
    console.log("app listening on PORT " + PORT);
});