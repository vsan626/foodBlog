let express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose");

//APP CONFIG
mongoose.connect("mongodb://localhost/foodBlog", {useNewUrlParser: true});
app.set("view engine", "ejs");
//USE CUSTOM STYLE SHEET
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


let blogSchema = new mongoose.Schema({
	restaurant: String,
	image: {type: String, default: "https://s3.amazonaws.com/cordillera-network/wp-content/uploads/sites/11/2019/02/08161129/In-N-Out-Burger-Logo.jpg"},
	body: String,
	created: {type: Date, default: Date.now}
});

//COMPILE SCHEMA INTO MODEL
let Blog = mongoose.model("Blog", blogSchema);



// ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs");
});

// // INDEX
app.get("/blogs", function(req, res){
	//find all blogs in db
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("Something Went Wrong!")
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

// NEW 
app.get("/blogs/new", function(req, res){
	res.render("new");
})

// Create
app.post("/blogs", function(req, res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	})
})

// Show
app.get("/blogs/:id", function(req, res){
	blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	})
})







app.listen(3000, function(){
    console.log("Server has started!!!");
});