// require all packages
const express = require("express");
const mongojs = require("mongojs");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
const axios = require("axios");

// start express
const app = express();

// set a port for the DB
const PORT = process.env.PORT || 4100;

// // define the database and collection
// var databaseURL = "scraper";
// var collections = ["scrapedData"];

// bring in the models
var db = require("./models");

// we will log some stuff with morgan
app.use(logger("dev"));
// define our static folder for css, etc
app.use(express.static("public"));
// using body parser for our forms
app.use(bodyParser.urlencoded({ extended: true }));
// handlebars will handle our layout
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// here we connect to Mongo and give it a promise
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
  useMongoClient: true
});

// show the main page if no route was requested
app.get("/", function (req, res) {
  db.article.find(function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.render("index", { data: found });
      console.log(found);
    }
  });
});

// our user wants to get new articles, go scrape the site
app.post("/scrape", function (req, res) {
  // let's empty out the news so we do not have any duplicates
  db.article.remove().exec();
  // let's see what is happening in the baseball world today
  axios("http://www.sportingnews.com/mlb/news").then(function (response) {
    var $ = cheerio.load(response.data);
    // go to the first parent = h3 with class media-heading
    $("h3.media-heading").each(function (i, element) {
            // create a new object to pass into the db
            var newArticle = {};
      // start with the base URL
      var link1 = 'http://www.sportingnews.com';
      // grab the URL from the article
      var link2 = $(element).children().attr("href");
      // concatenate to get the complete URL
      newArticle.link = link1 + link2;
      // get the title from the text of the a href
      newArticle.headline = $(element).children().text();

      // insert the article into the db
      db.article.create(newArticle)
        .then(function (dbArticle) {
          // confirm we were able to get new articles
          res.send("Got your latest news!");
        })
        // handle any errors
        .catch(function (error) {
          res.json(error);
        });
    });
    // send them back to the index to see the refreshed content
    res.redirect("/");
  });
});



app.listen(PORT, function () {
  console.log("app listening on PORT " + PORT);
});