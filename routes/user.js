const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup", (req, res) =>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async(req, res) => {
   try{
    let {username, email, password} = req.body;
    const newUser = new User({
        username: username,
        email: email,
    });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
   } catch(err) {
    req.flash("error", err.message);
    res.redirect("/signup");
   }
}))

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
    }
)

module.exports = router;