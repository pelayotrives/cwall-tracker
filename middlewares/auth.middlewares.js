module.exports = {

  isLoggedIn: (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  },

  isVip: (req, res, next) => {
    if (req.session.user.vip === true) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  }

};
