/******************
 * Account Controller
 * Unit 4, deliver login view activity
 ******************/
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult && regResult.rowCount) {
    req.flash(
      "success",
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

/* ****************************************
 *  Process login request
 *  unit 4 login process activity
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // Get account data by email
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Email not found. Please register or try a different email.");
    res.status(401).render("account/login", {
      title: "Login",
      nav,
      errors: null, // Initialize errors to null
    });
    return;
  }

  // Compare password with hashed password
  const isPasswordValid = await bcrypt.compare(account_password, accountData.account_password);
  if (!isPasswordValid) {
    req.flash("notice", "Invalid password. Please try again.");
    res.status(401).render("account/login", {
      title: "Login",
      nav,
      errors: null, // Initialize errors to null
    });
    return;
  }

  // Create JWT token
  const token = jwt.sign({ accountId: accountData.account_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

  // Set token in session or cookie (depending on your setup)
  req.session.token = token;

  req.flash("success", `Welcome, ${accountData.account_firstname}!`);
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
};