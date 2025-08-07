// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index.js")
const Validate = require("../utilities/inventory-validation");

/* ****************************************
 * Inventory Routes
 * These routes handle the inventory views
 **************************************** */

// Route to build Managementinventory Inventory
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
);

// Route to build inventory by classification view
// The word "type" is used to distinguish this route from the detail route
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to trigger a 500-type error
router.get(
  "/error",
  utilities.checkAccountType,
  utilities.handleErrors(invController.triggerError)
);

// Classification management routes
router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);
router.post(
  "/add-classification",
  utilities.checkAccountType,
  Validate.classificationRules(),
  Validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add Inventory management routes
router.get(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  Validate.inventoryRules(),
  Validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Build edit/update inventory views
router.get(
  "/edit/:inventoryId",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
);

// Update inventory item
router.post(
  "/update/",
  utilities.checkAccountType,
  Validate.inventoryRules(),
  Validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete vehicle information routes
router.get(
  "/delete/:inventoryId",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteInventory)
);
router.post("/delete/", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory)); // Don't need validation

module.exports = router;