var express  = require('express'),
bodyParser   = require('body-parser'),
mongoose     = require('mongoose');

mongoose.connect('mongodb://localhost:27017/YelpCamp_App',{useUnifiedTopology: true, useNewUrlParser: true});

var app  = express();

var campgroundSchema = new mongoose.Schema({
  	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model('Campground',campgroundSchema);


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
	res.render("landing");
});


app.get("/campgrounds",function(req,res){
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log("Encountered error while fetching data");
			console.log(err);
		}else{
			res.render("campground",{campground:campgrounds});
		}
	})
});

app.post("/campgrounds",function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	
	Campground.create({
		name: name,
		image: image,
		description: description
	},function(err,campground){
		if(err){
			console.log("something went wrong:");
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
	
});

app.get("/campgrounds/new",function(req,res){
	res.render("addcampgrounds");
});

app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log("Encountered error while finding a campground");
			console.log(err);
		}else{
			res.render("showcampgrounds",{campground:foundCampground});
		}
	})
	
})

app.listen(3000,function(){
	console.log("Yelp Camp server is started.....");
});