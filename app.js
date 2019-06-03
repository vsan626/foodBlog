let express 	= require("express"),
	methodOverride = require("method-override")
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose");
mongoose.set('useFindAndModify', false);

//APP CONFIG
mongoose.connect("mongodb://localhost/foodBlog", {useNewUrlParser: true});
app.set("view engine", "ejs");
//USE CUSTOM STYLE SHEET
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


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
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	})
})

// Edit
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, editBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: editBlog});
		}
	});
});

// Update
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs")
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// Delete
app.delete("/blogs/:id", function(req, res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs")
		}
	})
})




app.listen(3000, function(){
    console.log("Server has started!!!");
});