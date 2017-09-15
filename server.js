var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

var bodyParser = require("body-parser");
var logger = require("morgan");

var mongoose = require("mongoose");

var Blog = require ("./models/Blog.js");
var Note = require ("./models/Note.js");

      var SavedBlog = require ("./models/savedBlog.js");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect("mongodb://heroku_p47brjw9:ee2lr50knegr5qqctkpcp6o3up@ds133104.mlab.com:33104/heroku_p47brjw9");
var db = mongoose.connection;




// Static file support with public folder
app.use(express.static("public"));


// Database configuration for mongoose
// db: techCrunch
mongoose.connect("mongodb://localhost/techCrunch", {useMongoClient: true});
var db = mongoose.connection;
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//SCRAPINGGGGGGGGG
app.get("/scraper", function(req, res) {

  request("https://techcrunch.com/popular/", function(error, response, html) {
    var $ = cheerio.load(html);

    $(".river-block").each(function(i, element) {

      var result = {};

      result.blogId = $(this).attr("id");

      result.title = $(this).find("h2 a").text();

      result.link = $(this).find("h2 a").attr("href");

      result.summary = $(this).find("p.excerpt").text();

      console.log(result);

      // Using our Blog model, create a new entry
      // This effectively passes the result object to the entry (and the title and link and summary)
      var entry = new Blog(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });
    });
  });
  res.send("Scraping TechCrunch!");
});

// This will get the articles we scraped from the mongoDB
app.get("/blogs", function(req, res) {
  // Grab every doc in the Articles array
  Blog.find({}, function(error, doc) {
    console.log(doc);
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab a blog by it's ObjectId
app.get("/blogs/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Blog.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Create a new message or replace an existing message
app.post("/blogs/:id", function(req, res) {
  // Create a new message and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the blog id to find and update it's message
      Blog.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});




app.get("/notes", function(req, res) {
  // Grab every doc in the Note array
  Note.find({}, function(error, doc) {
    console.log(doc);
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// db.test_users.remove( {_id: ObjectId("4d512b45cc9374271b02ec4f")});
// db.collection.remove({"_id":{$type:7}})

//Delete saved notes
app.post("/notes/:id", function(req, res) {

  Note.remove({_id: req.params.id});
  // db.Note.update({_id: req.params.id}, { $unset : {body:1}},{multi: true});

console.log("reqparamsid = " + req.params.id);
});



// LISTENER
app.listen(process.env.PORT || 5000, function() {
  console.log("App running on port 5k!");
});
