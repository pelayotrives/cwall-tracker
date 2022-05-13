// const UserModel = require("../models/User.model.js");
// const router = require("express").Router();

// //GET: (/profile)=> Renderiza los datos de perfil del usuario
// router.get("/", async (req, res, next) => {
//   const {_id}=req.session.user
//   try {
//     let profile = await UserModel.findOne(_id);
//     res.render("profile/profile-form.hbs", {
//       profile,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// //POST: (/profile)=> Modifica los datos del usuario
// router.post("/", async (req, res, next) => {
//   const logUser = req.session.user;
//   const { username, email } = req.body;
//   try {
//     let profile = await UserModel.findByIdAndUpdate(logUser, {
//       username,
//       email
//     });
//     res.render("profile/profile.hbs", {
//       profile,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// //POST: (/profile/delete)=> elimina los datos del usuario
// router.post("/delete", async (req, res, next) => {
//   const logUser = req.session.user;
//   try {
//     let profile = await UserModel.findByIdAndDelete(logUser);
//     res.redirect("/auth/signup");
//   } catch (err) {
//     next(err);
//   }
// });
// module.exports = router;
