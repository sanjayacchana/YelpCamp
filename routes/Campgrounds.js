var express = require('express');
var routes  = express.Router();
var Campground = require('../models/Campgrounds');
var middleware  = require('../middleware');


routes.get("/",function(req,res){
	res.render("landing");
});

routes.get("/campgrounds",function(req,res){
	Campground.find({},function(err,foundedCampground){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index",{campground:foundedCampground});
		}
	});
});

routes.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});


routes.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	var author ={
		id: req.user._id,
		username: req.user.username
	};
	req.body.campground.description = req.sanitize(req.body.campground.description);

		var name = req.body.campground.name;
		var image = req.body.campground.image;
		var description = req.body.campground.description;
	
	var newCampground = {name:name,image:image,description:description,author:author};
	Campground.create(newCampground,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
	
});


routes.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundedCampground){
		if(err){
			res.redirect("/campgrounds");
			console.log(err);
		} else{
			res.render("campgrounds/show",{campground:foundedCampground});
		}
	});
});

routes.get("/campgrounds/:id/edit",middleware.checkForOwnerShip,function(req,res){
	Campground.findById(req.params.id,function(err,foundedCampground){
		res.render("campgrounds/edit",{campground:foundedCampground});
	});
});

routes.put("/campgrounds/:id",middleware.checkForOwnerShip,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampgroung){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});


routes.delete("/campgrounds/:id",middleware.checkForOwnerShip,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = routes;

