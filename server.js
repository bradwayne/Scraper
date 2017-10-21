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
    }
  });
});

// our user wants to get new articles, go scrape the site
app.post("/scrape", function (req, res) {
  // let's empty out the news so we do not have any duplicates
  db.article.remove().exec();
  // let's see what is happening in the baseball world today
  axios("https://www.amctheatres.com/movies").then(function (response) {
    var $ = cheerio.load(response.data);
    // go to the first parent = h3 with class media-heading
    // $("li.share-dialog-url").each(function (i, element) {
      $("div.MoviePostersGrid-text").each(function (i, element) {
            // create a new object to pass into the db
            var newArticle = {};
      // get the URL
      newArticle.link = 'https://www.amctheatres.com/' + $(element).children('a').attr('href');
      // get the headline
        newArticle.headline = $(element).children('h3').text();
      // get the summary
      newArticle.summary = $(element).children('div').children('p').children("span:last-of-type").text();

      // insert the article into the db
      db.article.create(newArticle)
        .then(function (dbArticle) {
          res.json(dbArticle);
        })
        // handle any errors
        .catch(function (error) {
          res.json(error);
        });
    });
    // send them back to the index to see thenew content
    // res.redirect("/");
  });
});

// show an individual article, including any notes
app.get("/saved", function(req,res) {
  db.article.find(function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.render("saved", { data: found });
    }
  });
});

// startup the server
app.listen(PORT, function () {
  console.log("app listening on PORT " + PORT);
});