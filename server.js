var cheerio = require("cheerio");
var axios = require("axios");


axios.get("https://www.wsj.com/").then(function (response) {

    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    $("h3").each(function (i, element) {

        // Save the text of the element in a "title" variable
        var title = $(element).text();

        var link = $(element).children().attr("href");

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
            title: title,
            link: link
        });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
});