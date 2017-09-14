// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var SavedBlogSchema = new Schema({
  // Just a string
  saved: {
    type: String
  },
  // Just a string
  messageTitle: {
    type: String
  },
  body: {
    type: String
  },

});

// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Blog model

// Create the Message model with the MessageSchema
var SavedBlog = mongoose.model("SavedBlog", SavedBlogSchema);

// Export the Note model
module.exports = SavedBlog;
