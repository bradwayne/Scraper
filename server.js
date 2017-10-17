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
db.on("error", function(error) {
    console.log("database error:", error);
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// grab the files that has the routes and logic
var main = require("./routes/api/index.js");
main(app, __dirname);

app.get("/scrape", function (req, res) {
var fetch = require("./routes/api/fetch.js");
fetch(app, __dirname);
});

var headlines = require("./routes/api/headlines.js");
headlines(app, __dirname);

var notes = require("./routes/api/notes.js");
notes(app, __dirname);

app.get("/", function(req,res) {
    res.send("Is anybody out there?");
});

app.get("/scrape", function (req, res) {
    fetch();
});

app.listen(PORT, function() {
    console.log("app listening on PORT " + PORT);
});