var Campground  = require('../models/Campgrounds');
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to logged in to do that");
	res.redirect("/login");
}

middlewareObj.checkForOwnerShip = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundedCampground){
			if(err){
				req.flash("error",err.message);
				res.redirect("back");
			} else{
				if(foundedCampground.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error","You don't have a permisson to do that");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error","You need to logged in to do that");
		res.redirect("/login");
	}
}

module.exports = middlewareObj;