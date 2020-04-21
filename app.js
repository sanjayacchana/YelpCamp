var express  = require('express'),
bodyParser   = require('body-parser');

var app  = express();

var campgrounds = [
	{
		name: "sanjay_acchana",
		image: "https://scontent.fhyd2-1.fna.fbcdn.net/v/t1.0-9/s960x960/87255840_2612644522306331_6522033784596987904_o.jpg?_nc_cat=111&_nc_sid=7aed08&_nc_ohc=xOsveNcFum8AX_TWa5O&_nc_ht=scontent.fhyd2-1.fna&_nc_tp=7&oh=6b3bda6d2f0f1139c00c34f9220a850a&oe=5EBEC247",
		description:"ananthagiri hills"
	},
	{
		name: "sanjay_acchana",
		image: "https://scontent.fhyd2-1.fna.fbcdn.net/v/t1.0-9/92572625_2646960085541441_8437822093214613504_n.jpg?_nc_cat=106&_nc_sid=85a577&_nc_ohc=5ioNJ7dMsDEAX9VfT3Z&_nc_ht=scontent.fhyd2-1.fna&oh=4ef0e80a35c674b4a7e4ea3fd3dd5d81&oe=5EC16576",
		description:"cricket time"
	},
	{
		name: "sanjay_acchana",
		image: "https://scontent.fhyd2-1.fna.fbcdn.net/v/t1.0-9/p960x960/82504661_2575546806016103_3555834700310249472_o.jpg?_nc_cat=111&_nc_sid=7aed08&_nc_ohc=fvynvbaCYJ4AX9BTHuO&_nc_ht=scontent.fhyd2-1.fna&_nc_tp=6&oh=8dc9da3925dee006e6a1853cfd619552&oe=5EC21A9D",
		description:"Office clicks"
	},
	{	name: "sanjay_acchana",
		image: "https://scontent.fhyd2-1.fna.fbcdn.net/v/t1.0-9/p960x960/67633912_2425898380980947_5364723733946695680_o.jpg?_nc_cat=111&_nc_sid=7aed08&_nc_ohc=v2yuftFsJjYAX8QHakE&_nc_ht=scontent.fhyd2-1.fna&_nc_tp=6&oh=28baa74074a4731df3fa149207fc86d0&oe=5EBEAAD3",
		description:"medak forest"
	},
	{	name: "sanjay_acchana",
		image: "https://scontent.fhyd2-1.fna.fbcdn.net/v/t31.0-8/p960x960/20746189_1996937283877061_1077264218242682174_o.jpg?_nc_cat=102&_nc_sid=7aed08&_nc_ohc=oP9NnWrzJkMAX9QGrBn&_nc_ht=scontent.fhyd2-1.fna&_nc_tp=6&oh=16115a8b4a3a3068bb51e3dbc8c8bf46&oe=5EC1E65F",
		description:"College days"
	},
];
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
	res.render("landing");
});


app.get("/campgrounds",function(req,res){
	res.render("campground",{campground:campgrounds});
});

app.post("/campgrounds",function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampGround = {name:name,image:image,description:description};
	campgrounds.push(newCampGround);
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res){
	res.render("addcampgrounds");
})

app.listen(3000,function(){
	console.log("Yelp Camp server is started.....");
});