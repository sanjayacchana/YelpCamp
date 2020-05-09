var express 	= require('express');
var passport    = require('passport');
var User        = require('../models/User');
var routes      = express.Router();

routes.get("/register",function(req,res){
	if(req.isAuthenticated()){
		req.logout();
	}
	res.render("register");
});

routes.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			res.redirect("/register");
		}else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to YelpCamp: " + user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});


routes.get("/login",function(req,res){
	res.render("login");
});


routes.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function(req,res){
	
});


routes.get("/logout",function(req,res){
	req.logout();
	req.flash("success", "You logged out successfully");
	res.redirect("/campgrounds");
});

module.exports = routes;
