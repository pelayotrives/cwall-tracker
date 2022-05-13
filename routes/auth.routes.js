const router = require("express").Router()

//! Sign Up
//* GET "/auth/signup" => Renderizar la vista del formulario de registro al usuario.

router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

//* POST "/auth/signup" => Renderizar la vista del formulario de registro al usuario.








//? ---------------------------------------------------------------------------------

//! Log In
// GET "/auth/login" => Renderizar la vista del formulario de acceso al usuario.

router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
})

module.exports = router