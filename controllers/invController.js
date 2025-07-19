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


module.exports = invCont