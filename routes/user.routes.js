const express = require("express")
const router = express.Router();
const UserModel = require("../models/user.model")
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
    res.render("templates/users/signup");
})

router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new UserModel({ email, username });
        const registeredUser = await UserModel.register(newUser, password);


        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            } else {
                req.flash("success", "User was registered successfully");
                return res.redirect("/listing");
            }
        })
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup")
    }
})

router.get("/login", (req, res) => {
    res.render("templates/users/login");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Successfully Logged in")
        let redirectUrl = res.locals.redirectUrl || "/listing";
        // res.send(redirectUrl);
        res.redirect(redirectUrl);
    });

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "User succesfully logged out")
        res.redirect("/listing");
    })
})
module.exports = router;