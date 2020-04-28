var mongoose     = require('mongoose');


//Define Campground Schema
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments:[{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	}]
});

//Define Model
module.exports = mongoose.model("Campground",campgroundSchema);
