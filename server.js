/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")


/* ***********************
 *View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
// Static files route
app.use(static)
// Base route
app.get("/", utilities.handleErrors(baseController.buildHome)) //Week 3
// Inventory route
app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* //Week1
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
}) */

  /* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const statusCode = err.status || 500;
  let message = err.message;

  // For security, don't leak server error details to the client
  if (statusCode !== 404) {
    message = 'Oh no! There was a server crash. We are working on it.';
  }

  res.status(statusCode).render("errors/error", {
    title: statusCode === 404 ? 'Page Not Found' : 'Server Error',
    message,
    nav,
  });
});


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
