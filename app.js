var express           = require('express'),
bodyParser   		  = require('body-parser'),
mongoose    		  = require('mongoose'),
expressSanitizer	  = require('express-sanitizer'),
passport			  = require('passport'),
passportLocal		  = require('passport-local'),
passportLocalMongoose = require('passport-local-mongoose'),
Campground   		  = require('./models/Campgrounds'),
Comments    		  = require('./models/Comments'),
User				  = require('./models/User');


// Outh config

mongoose.connect('mongodb://localhost:27017/YelpCamp_App',{useUnifiedTopology: true, useNewUrlParser: true});

var app  = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());

app.use(require('express-session')({
	secret: 'sanjay the untold story:-)', 
	resave: false, 
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// serves currentUser to all the pages
app.use(function(req,res,next){
	res.locals.currentUser =  req.user;
	next();
});

//Define Routes
//========================
//Campgrounds
//=======================

app.get("/",function(req,res){
	res.redirect("/campgrounds");
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

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
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

//Define routes for Auth
/*
=====================
Auth Routes
=====================
*/


app.get("/register",function(req,res){
	if(req.isAuthenticated()){
		req.logout();
	}
	res.render("register");
});

app.post("/register",function(req,res){
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


app.get("/login",function(req,res){
	res.render("login");
});


app.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function(req,res){
	
});


app.get("/logout",function(req,res){
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

app.listen(3000,function(){
	console.log("Yelp Camp server is started.....");
});