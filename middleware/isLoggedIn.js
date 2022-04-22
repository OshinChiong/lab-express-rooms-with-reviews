const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("index", {message: "You're not logged in."});
  }
};

module.exports = isLoggedIn;