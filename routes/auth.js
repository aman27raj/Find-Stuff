const express = require("express");
const router  = express();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport")
router.get("/login",function(req,res){
    res.render("login")
})

router.post("/login",function(req,res,next){
    passport.authenticate('local',{
        successRedirect: "/dashboard",
        failureRedirect: "/login"
    })(req,res,next);
})

router.get("/register",function(req,res){
    res.render("register")
})

router.post("/register",function(req,res){
    const { fullname, username , address, contact ,password , password2 } = req.body;
    let errors = [];
    if(!fullname || !username || !address || !contact || !password || !password2){
        errors.push({msg: "Please fill in all fields"})
    }
    if(password !== password2){
        errors.push({msg: "Password do not match"});
    }
    if(password.length < 4){
        errors.push({msg:"Password should be atleast 4 characters"});
    }
    if(errors.length >0){
        console.log(errors);
        res.render("register",{
            errors,
            fullname
        })
    }else{
        User.findOne({username:username},function(err,user){
            if(err){
                console.log(err);
            }else{
                if(user){
                    console.log("username exists");
                    res.render("register",{fullname});
                }else{
                    const newUser = new User({
                        fullname,
                        username,
                        address,
                        contact,
                        password
                    });
                    // Hash Password
                    bcrypt.genSalt(10,function(err,salt){
                        bcrypt.hash(newUser.password,salt,function(err,hash){
                            if(err) throw err;
                            //set password to hashed
                            newUser.password = hash;
                            newUser.save(function(err,savedUser){
                                if(err){
                                    console.log(err);
                                }else{
                                    res.redirect("/login");
                                }
                            })
                        })
                    })
                }
            }
        })


    }
})

router.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/");
})


module.exports = router;