const User = require("../models/User.model.js");
const router = require("express").Router();
const { isVip, isLoggedIn } = require("../middlewares/auth.middlewares.js");
const CryptoModel = require("../models/Crypto.model.js");

//GET : (/profile) => Renderiza la vista de los datos de perfil del usuario.
//! Con esta ruta, el nombre actualizado saldrá en pantalla también.

router.get("/", isLoggedIn, async (req, res, next) => {
  const { user } = req.session;
  const { _id } = req.session.user;
  try {
    let profile = await User.findById(_id);
    res.render("profile/profile.hbs", {
      profile,
    });
  } catch (err) {
    next(err);
  }
});

//GET: (/profile/edit)=> Renderiza la vista para poder editar los detalles del usuario.
router.get("/edit", async (req, res, next) => {
  const { user } = req.session;
  console.log(user);
  try {
    let profile = await User.findById(user._id);
    res.render("profile/profile-form.hbs", {
      profile,
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
    await User.findByIdAndUpdate(
      user._id,
      {
        username,
        email,
      }

      // {
      //   new: true //! Con esto creamos un nuevo objeto actualizado. Siempre hace falta cuando se usa res.render(), cuando se hace res.redirect() no hace falta.
      // }
    );

    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

//POST: (/profile/delete)=> elimina los datos del usuario
router.post("/delete", async (req, res, next) => {
  const { user } = req.session;
  try {
    await User.findByIdAndDelete(user._id);
    req.session.destroy(() => {
      //! Destroy es un método asíncrono, entocnes hay que pasarle una función para asegurarnos de que se ejecute DESPUÉS de destruir la sesión.
      res.redirect("/auth/signup");
    });
  } catch (err) {
    next(err);
  }
});

// POST UPLOAD FOTO PERFIL

const uploader = require("../middlewares/uploader");
const async = require("hbs/lib/async");

router.post("/upload", uploader.single("image"), async (req, res, next) => {
  console.log("intentando enviar la imagen");
  const { user } = req.session;
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(user._id, {
      image: req.file.path,
    });

    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
