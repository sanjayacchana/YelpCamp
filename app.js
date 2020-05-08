var express           = require('express'),
bodyParser   		  = require('body-parser'),
mongoose    		  = require('mongoose'),
expressSanitizer	  = require('express-sanitizer'),
methodOverride		  = require('method-override'),
passport			  = require('passport'),
passportLocal		  = require('passport-local'),
passportLocalMongoose = require('passport-local-mongoose'),
Campground   		  = require('./models/Campgrounds'),
Comments    		  = require('./models/Comments'),
User				  = require('./models/User');

var routeCampgrounds = require('./routes/Campgrounds'),
	routeComments    = require('./routes/Comments'),
	routeAuth	     = require('./routes/Auth');

// Outh config

mongoose.connect('mongodb://localhost:27017/YelpCamp_App',{useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

var app  = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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

app.use(routeCampgrounds);
app.use("/campgrounds/:id/comments",routeComments);
app.use(routeAuth);


app.listen(3000,function(){
	console.log("Yelp Camp server is started.....");
});