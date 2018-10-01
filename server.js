var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var db = require("./models");
var PORT = 3000;
var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsCommentor", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {

    axios.get("https://techcrunch.com/").then(function (response) {

        var $ = cheerio.load(response.data);

        $("h2").each(function (i, element) {
            var results = [];
            var title = $(element).children().text();
            var summary = $(element).parent().next().text();
            var link = $(element).children().attr("href");

            results.push({
                title: title,
                summary: summary,
                link: link
            });

            db.Article.create(results)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });
        res.send("Scrape Complete");
    });

})

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});