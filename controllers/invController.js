const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)

   // The utility function expects an array. If `data` is undefined (due to a model error),
  // I pass an empty array to prevent the application from breaking.
  const grid = await utilities.buildClassificationGrid(data || [])
  let nav = await utilities.getNav();
  let className;
  if (data && data.length > 0) {
    className = data[0].classification_name;
  } else {
    // We use a default class name if there are no vehicles or if `data` is not available.
    className = "There are not any";
  }
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  if (data) {
    const vehicleHTML = await utilities.buildDetailView(data)
    let nav = await utilities.getNav()
    const vehicleName = `${data.inv_make} ${data.inv_model}`
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      vehicleHTML,
    })
  } else {
    next({status: 404, message: "Sorry, error 404: we couldn't find that vehicle."})
  }
}

/* ***************************
 *  Trigger an intentional error
 * ************************** */
// This function will intentionally throw an error to test the error handling
  invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500-type server error. Whoops!");
}

/**********************************
 * Vehicle Management Controllers
 **********************************/

/* Build the main vehicle management view */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicles Management",
    nav,
    errors: null,
    classificationSelect,
  });
};

/**********************************
 * Building the add classification view
 **********************************/
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();

  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/**********************************
 * Controller function to add a vehicle
 * classification through a POST request.
 **********************************/
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const response = await invModel.addClassification(classification_name);
  let nav = await utilities.getNav();
  if (response) {
    req.flash(
      "success",
      `The "${classification_name}" classification was successfully added.`
      );
    res.redirect("/inv/");
    
  } else {
    req.flash("notice", `Failed to add ${classification_name}`);
    res.redirect("/inv/add-classification");
  }
};

/* Build the add inventory view */
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  let classifications = await utilities.buildClassificationList();

  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    errors: null,
    nav,
    classifications,
  });
};

/***********************************************
 * Controller for adding inventory vehicles:
 * Processes POST data and manages redirect logic
 ***********************************************/
invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

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

  const response = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    req.flash(
      "success",
      `The ${inv_year} ${inv_make} ${inv_model} successfully added.`
    );
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      errors: null,
    });
  } else {
    // This seems to never get called. Is this just for DB errors?
    req.flash("notice", "There was a problem.");
    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      errors: null,
    });
  }
};


module.exports = invCont