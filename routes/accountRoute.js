/* ****************************************
 * Account Routes
 * Unit 4, deliver login view activity
 **************************************** */
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")  


// Management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountManagementView)
);

/* ****************************************
 * Deliver Login View
 * Unit 4, deliver login view activity
 **************************************** */
router.get(
    "/login", 
    utilities.handleErrors(accountController.buildLogin)
);

/* ****************************************
 * Process Login
 * Unit 4, Process login activity
 **************************************** */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

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

/* ****************************************
 * Process Update account
 * Unit 5, Update account handlers
 **************************************** */
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdate));

router.post("/update", regValidate.updateRules(), 
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post("/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;