const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailView = async function(data){
    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.inv_price);
    const formattedMiles = new Intl.NumberFormat('en-US').format(data.inv_miles);
    let grid = `
        <div id="detail-view-container">
            <div class="detail-image">
                <img src="${data.inv_image}" alt="Image of ${data.inv_year} ${data.inv_make} ${data.inv_model}">
            </div>
            <div id="detail-data">
                <h2>${data.inv_make} ${data.inv_model} Details</h2>
                <p class="prominent-details"><strong>Price:</strong> ${formattedPrice}</p>
                <p><strong>Description:</strong> ${data.inv_description}</p>
                <p><strong>Color:</strong> ${data.inv_color}</p>
                <p><strong>Year:</strong> ${data.inv_year}</p>
                <p><strong>Miles:</strong> ${formattedMiles}</p>
            </div>
        </div>
    `
    return grid;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 *  Checking the Login.
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Build an HTML select element with
 * Wclassification data
 **************************************** */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';

   classificationList +=
    '<option value="" disabled selected>Choose a Classification</option>'; 
   
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`;

    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected";
    }

    classificationList += `>${row.classification_name}</option>`;
  });

  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 * Middleware to check user account type
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type == "Employee" ||
      res.locals.accountData.account_type == "Admin")
  ) {
    // check if logged in
    next(); //if logged in, allow user to continue
  } else {
    // ask user to log in
    req.flash(
      "notice",
      "Access restricted. Please log in as an Employee or Admin."
    );
    return res.redirect("/account/login");
  }
};

/**
 * Function to update the browser cookie.
 */

Util.updateCookie = (accountData, res) => {
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600,
  });
  if (process.env.NODE_ENV === "development") {
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
  } else {
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 1000,
    });
  }
};

/**
 * Build an html table string from the message array
 */
Util.buildInbox = (messages) => {
  inboxList = `
  <table>
    <thead>
      <tr>
        <th>Received</th><th>Subject</th><th>From</th><th>Read</th>
      </tr>
    </thead>
    <tbody>`;

  messages.forEach((message) => {
    inboxList += `
    <tr>
      <td>${message.message_created.toLocaleString()}</td>
      <td><a href="/message/view/${message.message_id}">${message.message_subject}</a></td>
      <td>${message.account_firstname} ${message.account_type}</td>
      <td>${message.message_read ? "✓" : " "}</td>
    </tr>`;
  });

  inboxList += `
  </tbody>
  </table> `;
  return inboxList;
};

Util.buildRecipientList = (recipientData, preselected = null) => {
  let list = `<select name="message_to" required>`;
  list += '<option value="">Select a recipient</option>';

  recipientData.forEach((recipient) => {
    list += `<option ${preselected == recipient.account_id ? "selected" : ""} value="${recipient.account_id}">${recipient.account_firstname} ${recipient.account_lastname}</option>`
  });
  list += "</select>"

  return list;

};

module.exports = Util;
