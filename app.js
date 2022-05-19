// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "cwall-tracker";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

// este middleware es para actualizar las variables globales SIEMPRE (en cada request del usuario)
app.use((req, res, next) => {
  if (req.session.user) {
    // Variable global de HBS para mostrar u ocultar elementos (por ejemplo, algunas zonas del NAV dependiendo del rol del usuario). True por defecto, la asignamos cuando
    res.locals.userIsActive = true;
    res.locals.username = req.session.user.username;

    // Al hacer login únicamente. Si el usuario tiene el valor de VIP como true...
    if (req.session.user.vip === true) {
      res.locals.userIsVip = true; // Asignamos a esta variable global el valor de true,
    }
  } else {
    //Pasa la variable local al falso para que podamos visualizar lo botones del nav que necesitamos
    res.locals.userIsActive = false; // Cuando deslogueamos, asignamos a false.
    res.locals.username = "";
    res.locals.userIsVip = false; // Cuando deslogueamos, asignamos a false.
  }

  next();
});

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
