/* ****************************************
 * Account Routes
 * Unit 4, deliver login view activity
 **************************************** */
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

/* ****************************************
 * Deliver Login View
 * Unit 4, deliver login view activity
 **************************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* ****************************************
 * Deliver Registration View
 * Unit 4, deliver registration view activity
 **************************************** */
router.get("/register", utilities.handleErrors(accountController.buildRegister));

module.exports = router;