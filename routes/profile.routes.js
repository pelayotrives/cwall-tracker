const User = require("../models/User.model.js");
const router = require("express").Router();

//GET : (/profile) => Renderiza la vista de los datos de perfil del usuario
router.get("/", (req, res, next) => {
  const { user } = req.session;
  res.render("profile/profile.hbs", {
    user
  })
})

//GET: (/profile/edit)=> Renderiza la vista para poder editar los detalles del usuario.
router.get("/edit", async (req, res, next) => {
  const { user } = req.session;
  console.log(user);
  try {
    let profile = await User.findById(user._id);
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

    let profileEdited = await User.findByIdAndUpdate(user._id, {
      username,
      email,
    },

    {
      new: true // Con esto creamos un nuevo objeto actualizado.
    });

    res.redirect("/profile", {
      profileEdited
    });

  } catch (err) {
    next(err);
  }
});

//POST: (/profile/delete)=> elimina los datos del usuario
router.post("/delete", async (req, res, next) => {
  const { user } = req.session;
  try {
    let profileDelete = await User.findByIdAndDelete(user._id);
    res.redirect("/auth/signup");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
