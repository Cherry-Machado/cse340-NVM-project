// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const Validate = require("../utilities/inventory-validation");

/* ****************************************
 * Inventory Routes
 * These routes handle the inventory views
 **************************************** */

// Route to build Managementinventory Inventory
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build inventory by classification view
// The word "type" is used to distinguish this route from the detail route
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to trigger a 500-type error
router.get("/error", utilities.handleErrors(invController.triggerError));

// Classification management routes
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);
router.post(
  "/add-classification",
  Validate.classificationRules(),
  Validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add Inventory management routes
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  "/add-inventory",
  Validate.inventoryRules(),
  Validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);


module.exports = router;