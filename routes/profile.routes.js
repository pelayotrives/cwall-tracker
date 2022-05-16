const User = require("../models/User.model.js");
const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("profile/profile.hbs")
})

//GET: (/profile)=> Renderiza los datos de perfil del usuario
router.get("/edit", async (req, res, next) => {
  const { user } = req.session;
  console.log(user);
  try {
    let profile = await User.findById(user);
    res.render("profile/profile-form.hbs", {
      user,
    });
  } catch (err) {
    next(err);
  }
});

//POST: (/profile)=> Modifica los datos del usuario
router.post("/edit", async (req, res, next) => {
  const { user } = req.session;
  const { username, email } = req.body;
  try {
    let profile = await User.findByIdAndUpdate(user, {
      username,
      email,
    });
    res.render("profile/profile.hbs", {
      profile,
    });
  } catch (err) {
    next(err);
  }
});

//POST: (/profile/delete)=> elimina los datos del usuario
router.post("/delete", async (req, res, next) => {
  const { user } = req.session;
  try {
    let profile = await User.findByIdAndDelete(id);
    res.redirect("/auth/signup");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
