/* ****************************************
 * Account Routes
 * Unit 4, deliver login view activity
 **************************************** */
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")  

/* ****************************************
 * Deliver Login View
 * Unit 4, deliver login view activity
 **************************************** */
router.get(
    "/login", 
    utilities.handleErrors(accountController.buildLogin)
);

/* ****************************************
 * Deliver Registration View
 * Unit 4, deliver registration view activity
 **************************************** */
router.get(
    "/register", 
    utilities.handleErrors(accountController.buildRegister)
);


/* ****************************************
 * Process Registration
 * Unit 4, Process registration activity
 **************************************** */
router.post(
    "/register", 
    regValidate.registrationRules(), 
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
);


module.exports = router;