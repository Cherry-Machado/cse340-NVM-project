/******************
 * Account Controller
 * Unit 4, deliver login view activity
 ******************/
const utilities = require("../utilities/");

/************************
 * Deliver Login View
 * Unit 4, deliver login view activity
 ************************/
const buildLogin = async (req, res, next) => {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
};

/************************
 * Deliver Registration View
 * Unit 4, deliver registration view activity
 ************************/
const buildRegister = async (req, res, next) => {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null, // Initialize errors to null
  });
};

module.exports = {
  buildLogin,
  buildRegister,
};