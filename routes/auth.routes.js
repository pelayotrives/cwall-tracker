const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const async = require("hbs/lib/async");
const User = require("../models/User.model.js");

// TODO ----------> Sign Up

//* GET "/auth/signup" => Renderizar la vista del formulario de registro al usuario.

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

//* POST "/auth/signup" => Toma los datos del usuario del formulario.

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validación de backend

  //! 1.) Todos los campos tienen que estar rellenados

  if (!username || !email || !password) {
    res.render("auth/signup.hbs", {
      errorMessage: "Fill in all the fields!",
    });
    //? Este return vacío indica que hasta aquí llega mi ruta. Se traduce a: "Si llega a haber un problema, detén la ejecución de la función anónima".
    return;
  }

  //! 2.) Hacer que el password sea seguro

  // Con este RegEx, el password debe incluir mínimo 8 caracteres, una letra minúscula, una letra mayúscula y un número.
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (passwordRegex.test(password) === false) {
    res.render("auth/signup", {
      errorMessage: "Improve your password!",
    });
    //? Este return vacío indica que hasta aquí llega mi ruta. Se traduce a: "Si llega a haber un problema, detén la ejecución de la función anónima".
    return;
  }

  // Conectamos con la base de datos para comprobar si existe un usuario con el nombre de usuario que queremos introducir.

  try {
    //! 3.) Comprobamos que ningún usuario en nuestra BBDD comparten nombre de usuario o email.

    const foundUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "User already registered!",
      });
      //? Este return vacío indica que hasta aquí llega mi ruta. Se traduce a: "Si llega a haber un problema, detén la ejecución de la función anónima".
      return;
    }

    //! 4.) Tras esto, deberemos crear un usuario. Aunque tendremos que cifrar su contraseña por LOPD.

    //* Le podemos dar el estándar que son 12 rondas de SALT o cifrado.
    const salt = await bcryptjs.genSalt(12);
    //* Ciframos el password introducido y le metemos las rondas de cifrado.
    const encryptedPassword = await bcryptjs.hash(password, salt);

    //* Ahora que tenemos cifrado el password, podemos crear el usuario.
    const createUser = await User.create({
      username,
      email,
      password: encryptedPassword,
    });

    //* Esto será lo último que suceda. Una vez se crea el usuario, le redirigimos para que haga login.
    res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
});

//? ---------------------------------------------------------------------------------

// TODO ----------> Log In

// * GET "/auth/login" => Renderizar la vista del formulario de acceso al usuario.

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

// * POST "/auth/login" => Toma los datos del usuario del formulario.

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // Validación de backend

  //! 1.) Todos los campos tienen que estar rellenados

  if (!username || !password) {
    res.render("auth/login.hbs", {
      errorMessage: "Fill in all the fields!",
    });
    //? Este return vacío indica que hasta aquí llega mi ruta. Se traduce a: "Si llega a haber un problema, detén la ejecución de la función anónima".
    return;
  }

  try {
    //! 2.) Validar que el usuario existe en la BBDD

    const foundUser = await User.findOne({ username: username });
    if (foundUser === null) {
      res.render("auth/login.hbs", {
        errorMessage: "User does not exist!",
      });
      //? Este return vacío indica que hasta aquí llega mi ruta. Se traduce a: "Si llega a haber un problema, detén la ejecución de la función anónima".
      return;
    }

    //! 3.) Validar que el password introducido corresponde al de dicho usuario.

    const passwordCheck = await bcryptjs.compare(password, foundUser.password);

    if (passwordCheck === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Invalid password!",
      });
      //? Este return vacío indica que hasta aquí llega mi ruta. Se traduce a: "Si llega a haber un problema, detén la ejecución de la función anónima".
      return;
    }

    //! 4.) Ahora tendremos que hacer una sesión activa del usuario ya que ya está autenticado.
    // * Creamos la sesión para recordarle si vuelve a la página y poder jugar con este parámetro.

    // Guardamos todo el usuario gracias a req.session, en la que buscamos la propiedad user y le decimos que foundUser es la sesión.
    // La traducción es: abrimos una sesión del usuario gracias a esto y la siguiente línea.
    req.session.user = foundUser; // esto es asincrono
    console.log(foundUser);

    req.session.save(() => {
      //! Tenemos que asegurarnos de que se salve la sesión despues de pasar todas las validaciones correctamente.
      //* Esto será lo último que suceda (después del catch). Una vez se crea el usuario, le redirigimos para que haga login.
      //! Cuando todo esté hecho en el login, redireccionaremos a profile aquí debajo.
      res.redirect("/profile");
    });
  } catch (err) {
    next(err);
  }
});

//? ---------------------------------------------------------------------------------

// TODO ----------> Log In

// * POST "/auth/logout" => Cerrar sesión del usuario.

router.post("/logout", (req, res, next) => {
  // Cierra la req.session del usuario logueado
  req.session.destroy(() => {
    //! Destroy es un método asíncrono, entocnes hay que pasarle una función para asegurarnos de que se ejecute DESPUÉS de destruir la sesión.
    res.redirect("/");
  });
});

module.exports = router;
