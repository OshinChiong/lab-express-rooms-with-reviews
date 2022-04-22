var express = require("express");
var router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/home", function (req, res, next) {
  res.render("user/home");
});

router.get("/signup", function (req, res, next) {
  res.render("user/signup");
});

router.post("/signup", function (req, res, next) {
  //1. Make sure all fields are filled out
  if (!req.body.email || !req.body.password || !req.body.fullName) {
    res.render("user/signup", { message: "Please fill out all fields" });
  }

  //2. Check if email already exists
  User.findOne({ email: req.body.email }).then((foundUser) => {
    if (foundUser) {
      res.render("user/signup", { message: "Email is taken" });
    } else {
      //3. Hash the password
      const salt = bcrypt.genSaltSync(saltRounds); //This will run 1024 times or 2^10 times
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      //4.Create the User
      User.create({
        email: req.body.email,
        fullName: req.body.fullName,
        password: hashedPassword,
      })
        .then((newlyCreatedUser) => {
          //We could create a session cookie right here
          //req.session.user = newlyCreatedUser
          res.render("index", {
            message: `Welcome, ${newlyCreatedUser.fullName}!`,
          });
        })
        .catch((err) => {
          console.log("Error while creating user", err.message);
        });
    }
  });
});

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post("/login", (req, res) => {
  //1.Check fields are filled out
  if (!req.body.email || !req.body.password || !req.body.fullName) {
    res.render("user/login", { message: "Please fill out all fields" });
  }

  //2. Make sure user exists
  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (foundUser) {
        //3.Check password

        //this returns true/false
        const doesMatch = bcrypt.compareSync(
          req.body.password,
          foundUser.password
        );

        if (doesMatch) {
          //4. Set up a session
          req.session.user = foundUser;
          res.redirect("/");
        } else {
          res.render("user/login", { message: "Incorrect Password" });
        }
      } else {
        res.render("user/login", { message: "Email not found" });
      }
    })
    .catch((err) => {
      res.render("user/login", { message: "Something went wrong" });
    });
});

router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.render("index", {message: "You are logged out"});
});

module.exports = router;