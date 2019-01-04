var express    = require("express");
var router     = express.Router();
var middleware = require("../middleware");
var Campground = require("../models/campground");
var User       = require("../models/user");

//User profiles 
router.get("/users/:id", function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      req.flash("error","User not found");
      res.redirect("/campgrounds");
    }
    Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
      if(err){
        req.flash("error","Something went wrong");
        res.redirect("/");
      }
      res.render("users/show", {user: foundUser, campgrounds: campgrounds});
    });
    
  });
});
//Edit user profile
router.get("/users/:id/edit", middleware.isLoggedIn, middleware.checkProfileOwnership, function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      console.log(err);
    } 
    res.render("users/edit", {user: foundUser});     
  });
});


//update user profile route
router.put("/users/:id", middleware.isLoggedIn, middleware.checkProfileOwnership, function(req, res){
  User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
    if(err){
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Succesfully Updated!");
      res.redirect("/users/" + req.params.id);
    }
  });
});

module.exports = router;