const express = require("express");
const mongojs = require("mongojs");
const request = require("request");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

function showAll() {
    app.get("/all", function (req, res) {
        db.scrapedData.find({}, function (error, found) {
          if (error) {
            console.log(error);
          }
          else {
            res.json(found);
          }
        }); 
      });
}

module.exports = showAll;