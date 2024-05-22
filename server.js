const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
const bcrypt = require('bcrypt')
const ejs = require('ejs');
const userModel = require('./users')
const batteryStationModel = require('./battery_stations')
const MongoStore = require('connect-mongo');
const cors = require('cors')
const user = require('./users')
require('dotenv').config();

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const mapbox_token = process.env.MAPBOX_TOKEN;
/* END secret section */

// Create database connection to use as the store option in the session object below
const db = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}`,
  crypto: {
    secret: mongodb_session_secret
  }
})

// Express application setup
app.set('view engine', 'ejs');
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve static files
app.use(express.static("src"));
app.use(express.static("scripts"));
app.use(express.static("videos"));
app.use(express.static(__dirname + "/public"));
app.use(express.static("public/images"));
app.use(express.static("public/videos"));

// Configure sessions
app.use(session({
  secret: bcrypt.hashSync(`${mongodb_session_secret}`, 10),
  resave: false,
  saveUninitialized: false,
  store: db,
  credentials: 'include',
  unset: 'destroy',
  cookie: { secure: false, maxAge: 3600000 }
}))

// Start application
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Landing page route
app.get('/', async (req, res) => {
  res.render("landing_page")
})

// Map testing route: routing
app.get('/routing', async (req, res) => {
  res.render("routing")
})

// Signup route
app.get('/signup', (req, res) => {
  res.render("signup")
})

// Login route
app.get('/login', (req, res) => {
  res.render("login")
})

// Package size route
app.get('/packagesize', (req, res) => {
  res.render("packagesize")
})

// Available route route
app.get('/availableroute', (req, res) => {
  res.render("availableroute")
})

// Available battery route
app.get('/availablebattery', (req, res) => {
  res.render("availablebattery")
})

// Select payment route
app.get('/selectpayment', (req, res) => {
  res.render("selectpayment")
})

// Confirmation route
app.get('/confirmation', (req, res) => {
  res.render("confirmation", { pageName: "confirmation" })
})

// Forget ID route
app.get('/forgotpassword', (req, res) => {
  res.render('forgotpassword')
})

// Reset password route
app.get('/resetpassword', (req, res) => {
  res.render('resetpassword')
})

// Post login route
app.get('/postlogin', (req, res) => {
  res.render("postlogin")
})

// Account route
app.get('/account', async (req, res) => {
  const userID = req.session.userid;  // get user ID from session
  console.log("User ID:", userID)
  try {
    const user = await userModel.findById(userID);  // check the user information based on the user ID
    res.render("account", { user: user });
  } catch (error) {
    console.error("Failed to fetch user name:", error);
    res.render("account", { user: null, error: 'Fail to get the user name' });
  }
})

// Profile Edit route
app.get('/profile_edit', async (req, res) => {

  const userID = req.session.userid;  // get user ID from session
  try {
    const user = await userModel.findById(userID);  // check the user information based on the user ID
    res.render("profile_edit", { user: user });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    res.render("profile_edit", { user: null, error: 'Fail to get the user data' });
  }
})

app.post('/profile_edit', async (req, res) => {
  const { username, email, phonenumber, street, city, postal } = req.body;
  const userID = req.session.userid;
  console.log("User ID:", userID)

  try {
    await userModel.findByIdAndUpdate(userID, {
      username,
      email,
      phonenumber,
      street,
      city,
      postal
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    res.json({ success: false, error: error.message });
  }
});

// Payment Edit route
app.get('/payment_edit', (req, res) => {
  res.render("payment_edit")
})

// Payment List route
app.get('/payment_list', (req, res) => {
  res.render("payment_list")
})

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

// Creates a new user from the body of the submitted form and writes to database
// ToDo: Need to handle errors when user is trying to create account with exisitng email
app.post('/signup', async (req, res) => {
  const newUser = await new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  console.log(newUser.username)
  console.log(newUser.name)
  console.log(newUser.email)
  req.session.userid = newUser.id
  await newUser.save()
  res.redirect("postlogin")
})

// Checks the login information and redirects to landing page if successful, otherwise redirect to index 
app.post('/login', async (req, res) => {
  const user = await userModel.findOne({ username: req.body.username })
  const isAuth = await bcrypt.compare(req.body.password, user.password)

  if (isAuth) {
    req.session.userid = user.id
    return res.redirect("postlogin")
  }
  else {
    res.redirect("/")
  }
})

// Returns user info of session owner
app.get('/getInfo', async (req, res) => {
  const userID = req.session.userid
  const userInfo = await userModel.findById({ _id: userID })
  // console.log(userInfo)
  res.send(userInfo)
})

// Updates the user with the given information in the req.body 
app.post('/update', async (req, res) => {
  const user = await userModel.findById(req.body.userID)
  console.log(req.body.query)
  await user.updateOne({ $set: req.body.query })
    .then(() => {
      console.log("saved")
    })
    .catch(error => {
      console.log(error)
    })
})


// Get geojson data for battery stations
app.get('/battery_stations', async (req, res) => {
  let battery_stations = await batteryStationModel.find({}, { _id: 0 })
  let geojsonData = {
    type: "FeatureCollection",
    features: battery_stations
  }
  res.render("battery_station_map", { stations: JSON.stringify(geojsonData) })
})

// Reset password route
app.post('/checkAccountExists', async (req, res) => {
  const userExists = await userModel.exists({ email: req.body.email })
  if (userExists) {
    res.render('resetpassword', { userEmail: req.body.email, renderErrorMessage: false })
  }
  else {
    res.render('forgotpassword', { userEmail: req.body.email, renderErrorMessage: true })
  }
})

// Updates the user with the given information in the req.body 
app.post('/changePassword', async (req, res) => {
  const newHashedPassword = await bcrypt.hash(req.body.password, 10)
  console.log(req.body.email)
  try {
    await userModel.findOneAndUpdate({ email: req.body.email }, { password: newHashedPassword }, { new: true })
  } catch (error) {
    console.log(error)
  }
  console.log("Password hashed to: " + newHashedPassword)
  res.redirect('/login')
}
)
//ToDo: Add 404 route
