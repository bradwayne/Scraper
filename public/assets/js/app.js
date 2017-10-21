// Grab the articles as a json
$.getJSON("/articles", function(data) {
    $("#articles").empty();
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link + "<br/>" + data[i].summary + "</p>");
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var articleID = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + articleID
    })
      // With that done, add the note information to the page
      .done(function(data) {
        // The title of the article
        $("#notes").append("<h3>Enter a note for " + data.headline + "...</h3><br/>");
        // An input to enter a new title
        $("#notes").append("Note Title:<br/> <input id='titleinput' name='title' ><br/>");
        // A textarea to add a new note body
        $("#notes").append("Comments:<br/> <textarea id='bodyinput' name='body'></textarea><br/>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
          // add a delete button
          $("#notes").append("<button data-id='" + data.note._id + "' id='delnote'>Delete Note</button>");
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });


  // When you click the delnote button
  $("#notes").on("click", "#delnote", function() {
    $("#notes").empty();
    // Run a POST request to delete
    $.ajax({
      method: "POST",
      url: "/delnote/" + $(this).attr("data-id")
    })
      // With that done
      .done(function(data) {
        
      });
    });