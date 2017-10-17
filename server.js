const express = require("express");
const mongojs = require("mongojs");
const request = require("request");
const cheerio = require("cheerio");
const hbps = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4100;

var databaseURL = "scraper";
var collections = ["scrapedData"];

var db = mongojs.apply(databaseURL, collections);
db.on("error", function(error) {
    console.log("database error:", error);
});

app.get("/", function(req,res) {
    res.send("Is anybody out there?");
});


app.listen(PORT, function() {
    console.log("app listening on PORT " + PORT);
});