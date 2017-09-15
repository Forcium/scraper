// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var BlogSchema = new Schema({
  blogId: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Blog model with the BlogSchema
var Blog = mongoose.model("Blog", BlogSchema);

// Export the model
module.exports = Blog;
