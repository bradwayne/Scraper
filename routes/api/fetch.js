const express = require("express");
const mongojs = require("mongojs");
const request = require("request");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

var databaseURL = "scraper";
var collections = ["scrapedData"];

var db = mongojs.apply(databaseURL, collections);
db.on("error", function(error) {
    console.log("database error:", error);
});

function fetchAll() {
    db.scrapedData.remove({});
    request("https://orlando.craigslist.org/d/pets/search/pet", function (error, response, html) {
        var $ = cheerio.load(html);
        $("a.result-title").each(function (i, element) {
    
          var link = $(element).attr("href");
          var title = $(element).text();
    
         db.scrapedData.insert({ title: title, link: link });
         console.log("title", title, "link", link);
        });
      });
}
module.exports = fetchAll;