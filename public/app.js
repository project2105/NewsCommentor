$.getJSON("/articles", function (data) {
    for (var i = 1; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'><strong>" + data[i].title + "</strong><br/>" + data[i].summary + "<br/>" + data[i].link + "</p>");
    }
});

$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#comments").append("<h2>" + data.title + "</h2>");
            $("#comments").append("<input id='titleinput' name='title' >");
            $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

            if (data.comment) {
                $("#titleinput").val(data.comment.title);
                $("#bodyinput").val(data.comment.body);
            }
        });
});

$(document).on("click", "#savecomment", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});