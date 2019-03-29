const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'username'},function(username,password,done){
            //Match User
            User.findOne({username:username},function(err,user){
                if(err){
                    console.log(err);
                }else{
                    if(!user){
                        return done(null,false,{message:"That usrname is doesn't exists"});
                    }
                    //Match Password
                    bcrypt.compare(password,user.password,function(err,isMatch){
                        if(err) throw err;
                        if(isMatch){
                            return done(null,user);
                        }else{
                            return done(null,false,{message:"Password incorrect"});
                        }
                    });
                }
            })
        })
    );
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        })
    });
}