const passportLocalMongoose = require("passport-local-mongoose"),
              LocalStrategy = require("passport-local"),
                       User = require("./models/users"), 
                 bodyParser = require("body-parser"),
                   passport = require("passport"), 
                   mongoose = require("mongoose"),
                    express = require("express");

mongoose.connect("mongodb://localhost:27017/new_user_login", { useNewUrlParser: true });


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
    secret: "Coding is amazing",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(express.static("models"));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function(req, res){
    res.render("home");
});

app.get("/sirGeorge", function(req, res){
    res.render("sirGeorge");
});
app.get("/hassett", function(req, res){
    res.render("hassett");
});
app.get("/hollis", function(req, res){
    res.render("hollis");
});

app.get("/apply", function(req, res){
    res.render("apply");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});



app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
     req.body.username
     req.body.password
     User.register(new User({username:req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/secret");
       });
     });
});

app.get("/login", function(req, res){
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }), function(req, res){
});
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function(){
    console.log("Auth Server is now Active...");
});

