// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

/* ****************************************
 * Inventory Routes
 * These routes handle the inventory views
 **************************************** */

// Route to build inventory by classification view
// The word "type" is used to distinguish this route from the detail route
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to trigger a 500-type error
router.get("/error", utilities.handleErrors(invController.triggerError));

module.exports = router;