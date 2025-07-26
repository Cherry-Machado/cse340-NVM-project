/******************
 * Account Controller
 * Unit 4, deliver login view activity
 ******************/
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

/************************
 * Deliver Login View
 * Unit 4, deliver login view activity
 ************************/
const buildLogin = async (req, res, next) => {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null, // Initialize errors to null
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

/************************
 * Process Registration
 * Unit 4, Process registration activity
 ************************/
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;


  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null, // Initialize errors to null
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null, // Initialize errors to null
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
};