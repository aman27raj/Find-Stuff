var express = require("express"),
    app     = express();
    var passport = require("passport");
    const methodOverride=require("method-override");
require("./config/passport")(passport);
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/mini_project",{useNewUrlParser:true});
var Product = require("./models/product");
var User = require("./models/user");


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
//express session
app.use(require("express-session")({
    secret: "red john",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})


app.use(require("./routes/auth"));


app.get("/",function(req,res){
    res.render("index");
})



app.get("/new",isLoggedIn,function(req,res){
    res.render("new");
})

app.get("/dashboard",isLoggedIn,function(req,res){
    Product.find({'owner.id':req.user._id},function(err,products){
        if(err){
            console.log(err);
        }else{
            res.render("dashboard",{products:products});
        }
    })

})

app.post("/dashboard",isLoggedIn,function(req,res){
    var owner = {
        id: req.user._id,
        fullname: req.user.fullname,
        contact: req.user.contact,
        address: req.user.address
    };
    req.body.product.owner = owner;
    Product.create(req.body.product,function(err,newProduct){
        if(err){
            console.log(err);
        }else{
            res.redirect("/dashboard");
        }
    })
})

app.delete("/dashboard/:id",isLoggedIn,function(req,res){
    Product.findOneAndRemove(req.params.id,function(err,deletedProduct){
        res.redirect("/dashboard");
    })
})

app.get("/dashboard/:id/edit",isLoggedIn,function(req,res){
    res.render("editprofile");
})
app.put("/dashboard/:id",isLoggedIn,function(req,res){
    User.findByIdAndUpdate(req.params.id,req.body.user,function(err,userUpdated){
        if(err){
            console.log(err);
        }
        res.redirect("/dashboard");
})
})

app.get("/:category",function(req,res){
    Product.find({category:req.params.category},function(err,products){
        if(err){
            console.log(err);
        }else{
            // console.log(products)clea
            res.render("category",{products:products});
        }
    })
})

app.get("/:category/:id",isLoggedIn,function(req,res){
    Product.findById(req.params.id,function(err,product){
        res.render("show",{product:product});
    })
})



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


const PORT = process.env.PORT || 5000
app.listen(PORT,function(){
    console.log("Server is started");
})    