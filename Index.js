const express = require('express');
const req = require('express/lib/request');
const path = require ('path');
var myApp = express();
const session = require('express-session');

//DB connection
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/MyBlog',
{
    UseNewUrlParser: true,
    UseUnifiedTopology: true
});

//Setup DB model
const Blog = mongoose.model('blog', {
    blogtitle : String, 
    img : String,
    description : String,
    type : String,
    publisheddate : String,
    authorname : String,
    gender:String,
    email :String,
    password : String
})

//Setup Session
myApp.use(session({
    secret : "thisismyrandomkeysuperrandomsecretbyaniketrana",
    resave : false,
    saveUninitialized : true
}))



const {check, validationResult} = require ('express-validator'); //for validation 
const { stringify } = require('querystring');

myApp.use(express.urlencoded({extended:true}));

// Set path to public and views folder.
myApp.set ('views', path.join(__dirname, 'views'));
myApp.use (express.static(__dirname + '/public'));
myApp.set ('view engine', 'ejs');

//home
myApp.get('/', function(req, res){
    res.render('home');//home page
});

//Login
myApp.get('/login', function(req, res){
    res.render('login');//login page
});

//add blog
myApp.get('/form', function(req, res){
    res.render('form');//add blog page
});

myApp.get('/blogs',(req,res) =>{
    //read data from Database
        Blog.find({}).exec(function(err,blogs){
        console.log(err);
        res.render('blogs', {blogs:blogs});
    })
})

myApp.get('/list',(req,res) =>{
    //read data from Database
    if (req.session.userLoggedIn) {
        Blog.find({}).exec(function(err,blogs){
        console.log(err);
        res.render('list', {blogs:blogs});
        })
    }
    else {
        res.redirect('/login');
    }
})

//Details of Blog
myApp.get('/DetailsBlog/:id', (req,res) => { // Whatever comes afte : is considered as a parameter. 

        var id = req.params.id;
        console.log(id);
        Blog.findOne({_id : id}).exec(function (err, blog) {
            console.log(`Error: ${err}`);
            console.log(`Blog: ${blog}`);
            if (blog) {
                res.render ('DetailsBlog', {blog : blog});
            }
            else {
                res.send ('No blog was found with this id..!');
            }
        })
})

//Logout Page
myApp.get('/logout', (req, res) => {
    req.session.username = '';
    req.session.userLoggedIn = false;
    res.render('login', {error : "Successfully logged out!"});
})

myApp.post('/form',[
    check ('blogtitle', 'blog title field is required.').notEmpty(),
    check ('img', 'Image field is required.').notEmpty(),
    check ('description', 'description field is required.').notEmpty(),
    check ('type', 'Blog type field is required.').notEmpty(),
    check ('publisheddate', 'Published date field is required.').notEmpty(),
    check ('authorname', 'author Name field is required.').notEmpty(),
    check ('gender', 'gender field is required.').notEmpty(),
    check ('email', 'Please enter a valid email address!').isEmail(),
    check ('password', 'password field is required.').notEmpty()

],function(req, res){

    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty())
    {
        res.render('form', {errors : errors.array()});
    }
    else 
    {
        var blogtitle = req.body.blogtitle;
        var img = req.body.img;
        var description = req.body.description;
        var type = req.body.type;
        var publisheddate = req.body.publisheddate;
        var authorname = req.body.authorname;
        var gender = req.body.gender;
        var email = req.body.email;
        var password = req.body.password;    
    
        var pageData = {
            blogtitle:blogtitle,
            img:img,
            description:description,
            type:type,
            publisheddate:publisheddate,
            authorname:authorname,
            gender:gender,
            email:email,
            password:password
        }
        
        var myBlog = new Blog(pageData);

        //Save in DB
        myBlog.save().then(function () {
            console.log('New Blog is Created');
            //res.redirect("/list");
        })
    };
    res.render('form', pageData); // no need to add .ejs extension to the command.
});

// Login Page
myApp.get('/login', (req,res) => {
    res.render('login');
})

myApp.post('/login', function (req,res) {
    var user = req.body.email;
    var pass = req.body.pass;
    console.log(`Error: ${user} ${pass}`);

    Blog.findOne({username : user, password : pass}).exec(function (err, admin) {
        // log any errors
        console.log(`Error: ${err}`);
        console.log(`Admin: ${admin}`);

        if (admin) // If Admin object exists - true
        {
            //store username in session and set login in true
            req.session.username = admin.username;
            req.session.userLoggedIn = true;
            res.redirect('/list');
        }
        else
        {
            //Display error if user info is incorrect
            res.render('login', {error : "Sorry Login Failed. Please try again!"});
        }
    })
})

//Delete Page
myApp.get('/delete/:id', (req,res) => { // Whatever comes afte : is considered as a parameter. 
    //Check if session is created
    if (req.session.userLoggedIn) {
        //Delete 
        var id = req.params.id;
        console.log(id);
        Blog.findByIdAndDelete({_id : id}).exec(function (err, blog) {
            console.log(`Error: ${err}`);
            console.log(`Blog: ${blog}`);
            if (blog) {
                res.render ('delete', {message : "Record Deleted Successfully!"});
            }
            else {
                res.render ('delete', {message : "Sorry, Record Not Deleted!"});
            }
        })
    }
    else {
        //Otherwise redirect user to login page.
        res.redirect('/login');
    }

})

//Edit Page
myApp.get('/edit/:id', (req,res) => { // Whatever comes afte : is considered as a parameter. 
    //Check if session is created
    if (req.session.userLoggedIn) {
        //Edit 
        var id = req.params.id;
        console.log(id);
        Blog.findOne({_id : id}).exec(function (err, blog) {
            console.log(`Error: ${err}`);
            console.log(`Blog: ${blog}`);
            if (blog) {
                res.render ('edit', {blog : blog});
            }
            else {
                res.send ('No blog was found with this id..!');
            }
        })
    }
    else {
        //Otherwise redirect user to login page.
        res.redirect('/login');
    }
})


//Edit Page - Post Method
myApp.post('/edit/:id', [
    check ('blogtitle', 'blog title field is required.').notEmpty(),
    
    check ('description', 'description field is required.').notEmpty(),
    check ('type', 'Blog type field is required.').notEmpty(),
    check ('publisheddate', 'Published date field is required.').notEmpty(),
    check ('authorname', 'author Name field is required.').notEmpty(),
    check ('gender', 'gender field is required.').notEmpty()
],function(req, res){

    //Check if errors
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty())
    {
        //Edit 
        var id = req.params.id;
        console.log(id);
        Blog.findOne({_id : id}).exec(function (err, blog) {
            console.log(`Error: ${err}`);
            console.log(`blog: ${blog}`);
            if (blog) {
                res.render ('edit', {blog : blog, errors : errors.array()});
            }
            else {
                res.send ('No blog was found with this id..!');
            }
        })
    }
    else 
    {
        //No errors
        var blogtitle = req.body.blogtitle;
        var description = req.body.description;
        var type = req.body.type;
        var publisheddate = req.body.publisheddate;
        var authorname = req.body.authorname;
        var gender = req.body.gender;
        
        var pageData = {
            blogtitle:blogtitle,
            description:description,
            type:type,
            publisheddate:publisheddate,
            authorname:authorname,
            gender:gender
        }

        var id = req.params.id;
        Blog.findOne({_id : id}).exec(function(err, blog){
                blog.blogtitle = blogtitle;
                //blog.img = img;
                blog.description = description;
                blog.type = type;
                blog.publisheddate = publisheddate;
                blog.authorname = authorname;
                blog.gender = gender;
                blog.save();
        })
       
        //Display the Output: Updated Information
       res.render('editsuccess', pageData); // no need to add .ejs extension to the command.
       //res.redirect('/list');
    }
});

myApp.get('/author', function(req, res){
    res.render('author', {
        name: "Aniket Rana",
        studentNumber: "8757169"
    });
});

myApp.listen(8080);
console.log('Everything executed fine... Open http://localhost:8080/');