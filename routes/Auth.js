var express = require('express');
var passport = require('passport');
var User     = require('../models/User');
var routes  = express.Router();

routes.get("/register",function(req,res){
	if(req.isAuthenticated()){
		req.logout();
	}
	res.render("register");
});

routes.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			res.redirect("/register");
		}else{
			passport.authenticate("local")(req,res,function(){
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
	res.redirect("/");
});

// middleware function
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = routes;
