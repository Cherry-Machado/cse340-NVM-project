const utilities = require("./index");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 *  Rules to validate the add
 *  classification Data.
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and nedd to be an string.
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid classification name."),
  ];
};

/* ******************************
 * Thisfunctions is to check data
 * and return errors and if all is
 * well, then continue to registration.
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      // Have to do it again.
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* **********************************
 *  Rules to be applied to the
 * AddInventory Data Validation.
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // Make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Year value missing.")
      .isNumeric()
      .withMessage("Year must be a number."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an image."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail."),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Price value is missing.")
      .isNumeric()
      .withMessage("Price must be a number."),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Miles value is missing.")
      .isNumeric()
      .withMessage("Miles must be a number."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),

    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("Please select a Classification."),
  ];
};

/* ******************************
 * Thisfunctions is to check data
 * and return errors and if all is
 * well, then continue to registration.
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;
    let classifications = await utilities.buildClassificationList(
      classification_id
    );
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      // Try again
      errors,
      title: "Add Inventory",
      nav,
      classifications,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to update. Errors will redirect to edit view
 * Week 5 - Update Inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;
    let classifications = await utilities.buildClassificationList(
      classification_id
    );
    let nav = await utilities.getNav();
    res.render("inventory/editInventory", { // Try again
      errors,
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      classifications,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;
