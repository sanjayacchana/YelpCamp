var mongoose = require('mongoose');

// define Comments Schema

var commentSchema = new mongoose.Schema({
	text: String,
	author: String
});


//Define model for Comments Schema

module.exports = mongoose.model("Comment",commentSchema);