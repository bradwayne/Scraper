const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schemaArticles = new Schema({

    link: {
        type: String,
        required: true
    },

    headline: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "note"
    }
});

var article = mongoose.model("article",schemaArticles)
module.exports = article;