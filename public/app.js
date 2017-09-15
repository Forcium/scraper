//smash that scraper button
$('#scrape').click(function() {
  $.ajax({type: 'GET', url: '/scraper'});

  setTimeout(function() {
    window.location.href = window.location.href
  }, 2000)
});

//````````````````````````````````````````````````````````````````````
$('#notes').click(function() {
  modal2.style.display = "block";
  $.ajax({type: 'GET', url: '/notes'});
});

// Grab the blogs as a json
$.getJSON("/notes", function(data) {


  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var noteReturn = "<p class='separate'>" + data[i].blog + "<br/><a class='linkEdit' target='_blank' href='" + data[i].link + "'>View Blog<a/>" + "</br>" + data[i].title + "</br>" + data[i].body + "<br/><button data-id='" + data[i]._id + "' id='delete'>Delete!</button></p>";

    $("#viewNotes").append(noteReturn);
    var thisId = $(this).attr("data-id");
  }
});


$(document).on("click", "#delete", function() {
  var thisId = $(this).attr("data-id");
  console.log("delete button id = " + thisId);
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId
  })
  .done(function(data) {
  console.log(data);
  // document.location.reload();
  });
});


//````````````````````````````````````````````````````````````````````


// Grab the blogs as a json
$.getJSON("/blogs", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var blogReturn = "<p id='fresh' data-id='" + data[i]._id + "'class='separate'>" + "<a class='linkEdit' target='_blank' href='" + data[i].link + "'>" + data[i].title + "<a/>" + "</br>" + data[i].summary + "</p>";

    $("#blogs").append(blogReturn);
  }
});



// Whenever someone clicks a #fresh tag
$(document).on("click", "#fresh", function() {

  //pull up modal to add message on selected blog
  modal.style.display = "block";

  console.log("clicked a #fresh tag");
  // Empty the messages from the message section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");


  // Now make an ajax call for the Blog
  $.ajax({
    method: "GET",
    url: "/blogs/" + thisId
  })
  // With that done, add the message information to the page
    .done(function(data) {
    console.log(data);

    //The Title of Blog and Link
    $("#savedNote").append("<p class='separate'>" + data.title + "<br/><a class='linkEdit' target='_blank' href='" + data.link + "'>View Blog<a/></p>");
    // // The link
    // $("#savedNote").append("<a class='linkEdit' target='_blank' href='" + data.link + "'>View Blog<a/>");
    // An input to enter a new title
    $("#savedNote").append("<input id='titleinput' name='title' >");
    // A textarea to add a new note body
    $("#savedNote").append("<textarea id='bodyinput' name='body'></textarea>");
    // A button to submit a new note, with the id of the article saved to it
    $("#savedNote").append("<button data-id='" + data._id + "' id='saveNote'>Save Note</button>");
  });
});

//when clicking the button, save blog
$(document).on("click", "#saveNote", function() {
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/blogs/" + thisId,
    data: {
      //blog title
      blog: $("#savedNote .separate").text(),
      //blog link
      link: $(".linkEdit").attr("href"),
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  }).done(function(data) {
    console.log(data);
    $("#savedNote").empty();
  });
  $("#titleinput").val("");
  $("#bodyinput").val("");
  document.location.reload();
});

// Get the modal
var modal = document.getElementById('myModal');


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  document.location.reload();
}

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//     document.location.reload();
//   }
// }



//
var modal2 = document.getElementById('myModal2');

// Get the <span> element that closes the modal
var span2 = document.getElementsByClassName("close2")[0];


span2.onclick = function() {
  modal2.style.display = "none";
  document.location.reload();
}

// window.onclick = function(event) {
//   if (event.target == modal2) {
//     modal2.style.display = "none";
//     document.location.reload();
//   }
// }
