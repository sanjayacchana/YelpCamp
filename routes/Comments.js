var express 	= require('express');
var routes 	= express.Router({mergeParams:true});
var Campground  = require('../models/Campgrounds');
var Comments    = require('../models/Comments');
var middleware  = require('../middleware');

routes.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new",{campground:campground});
		}
		
	})
	
});

routes.post("/",function(req,res){
	req.body.comment.text = req.sanitize(req.body.comment.text);
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		} else{
			Comments.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					console.log(req.user.username);
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});

module.exports = routes;
