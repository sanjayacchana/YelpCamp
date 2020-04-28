var express  = require('express'),
bodyParser   = require('body-parser'),
mongoose     = require('mongoose'),
expressSanitizer = require('express-sanitizer'),
Campground   = require('./models/Campgrounds'),
Comments    = require('./models/Comments');


// Outh config

mongoose.connect('mongodb://localhost:27017/YelpCamp_App',{useUnifiedTopology: true, useNewUrlParser: true});

var app  = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());


//Define Routes
//========================
//Campgrounds
//=======================

app.get("/",function(req,res){
	res.render("landing");
});

app.get("/campgrounds",function(req,res){
	Campground.find({},function(err,foundedCampground){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index",{campground:foundedCampground});
		}
	});
});

app.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new");
});


app.post("/campgrounds",function(req,res){
	req.body.campground.description = req.sanitize(req.body.campground.description);
	Campground.create(req.body.campground,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
	
});




app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundedCampground){
		if(err){
			res.redirect("/campgrounds");
			console.log(err);
		} else{
			res.render("campgrounds/show",{campground:foundedCampground});
		}
	});
});

//Define routes for comments
/*
=====================
Comments Routes
=====================
*/

app.get("/campgrounds/:id/comments/new",function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new",{campground:campground});
		}
		
	})
	
});

app.post("/campgrounds/:id/comments",function(req,res){
	req.body.comment.text = req.sanitize(req.body.comment.text);
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		} else{
			Comments.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});

app.listen(3000,function(){
	console.log("Yelp Camp server is started.....");
});