const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
const bcrypt = require('bcrypt')
const ejs = require('ejs');
const { user: userModel, payment: paymentModel } = require('./users');
const batteryStationModel = require('./battery_stations')
const MongoStore = require('connect-mongo');
const cors = require('cors')
const user = require('./users')
require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Joi = require('joi');

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const mapbox_token = process.env.MAPBOX_ACCESS_TOKEN;
/* END secret section */

// Create database connection to use as the store option in the session object below
const db = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}`,
  crypto: {
    secret: mongodb_session_secret
  }
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pics',
    format: async (req, file) => 'png',
    public_id: (req, file) => 'computed-filename-using-request'
  },
});

const parser = multer({ storage: storage });

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

// profile Joi schema
const userSchema = Joi.object({
  username: Joi.string().trim().required(),
  phonenumber: Joi.string().trim().pattern(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/),
  street: Joi.string().trim().regex(/^[a-zA-Z0-9\s]*$/),
  city: Joi.string().trim().regex(/^[a-zA-Z0-9\s]*$/),
  postal: Joi.string().trim().pattern(/^[A-Za-z0-9]{3}\s[A-Za-z0-9]{3}$/)
});

// payment Joi schema
const cardSchema = Joi.object({
  cardType: Joi.string().valid('Debit', 'Credit', 'Crypto').required(),
  cardNumber: Joi.string().trim().pattern(/^(?:\d{4} ){3}\d{4}$/).required(),
  cvv: Joi.string().trim().pattern(/^\d{3}$/).required(),
  expiryDate: Joi.string().trim().pattern(/^(0[1-9]|1[0-2])\/(24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88|89|90|91|92|93|94|95|96|97|98|99)$/).required()
});


const isAuth = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.session.email })
  if (user) {
    next();
  }
  else {
    res.status(403)
    return res.render("login", { errorMessage: "Please login first." })
  }
}

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

// Available route route
app.get('/availableroute', (req, res) => {
  res.render("availableroute")
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
app.get('/postlogin', isAuth, async (req, res) => {
  let userID = req.session.userid
  let cards = await paymentModel.find({ userId: userID }, { userId: 0, __v: 0 })

  if (isAuth) {
    res.render("postlogin", { cards: JSON.stringify(cards) })
  }
})

// Account route
app.get('/account', async (req, res) => {
  const userID = req.session.userid;
  try {
    const user = await userModel.findById(userID);
    if (!user.profileImageUrl) {
      user.profileImageUrl = 'profile.png';
    }
    res.render("account", { user: user });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    res.render("account", { user: null, error: 'Fail to get the user data' });
  }
});

// Upload profile image route
app.post('/upload_profile_image', parser.single('image'), async (req, res) => {
  const userID = req.session.userid;
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }
  try {
    const user = await userModel.findById(userID);
    user.profileImageUrl = req.file.path;
    await user.save();
    res.json({ success: true, message: "File uploaded successfully", url: req.file.path });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: "Failed to process file", error: error.toString() });
  }
});

// Profile Edit route
app.get('/profile_edit', async (req, res) => {
  console.log('Received data:', req.body);

  const userID = req.session.userid;
  try {
    const user = await userModel.findById(userID);
    res.render("profile_edit", { user: user });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    res.render("profile_edit", { user: null, error: 'Fail to get the user data' });
  }
})

app.post('/profile_edit', async (req, res) => {
  const data = req.body;
  delete data.email;
  console.log('Received data:', req.body);
  const { error, value } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorDetails = error.details.map(detail => {
      let message;
      switch (detail.path[0]) {
        case 'username':
          message = 'Username is required and must not contain special characters.';
          break;
        case 'phonenumber':
          message = 'Phone number must be in the format 777-777-7777 and must not contain special characters.';
          break;
        case 'street':
          message = 'Street address must not contain special characters.';
          break;
        case 'city':
          message = 'City name must not contain special characters.';
          break;
        case 'postal':
          message = 'Postal code must be in the format VVV VVV and must not contain special characters.';
          break;
        default:
          message = 'Invalid input data.';
      }
      return {
        field: detail.path[0],
        message: message
      };
    });
    console.error("Validation Error:", errorDetails);
    return res.status(400).json({
      success: false,
      message: "Invalid input data",
      errors: errorDetails
    });
  }

  // update user profile after validation
  const { username, phonenumber, street, city, postal } = value;
  const userID = req.session.userid;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(userID, {
      username,
      phonenumber,
      street,
      city,
      postal
    }, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new payments route
app.get('/payment_edit', async (req, res) => {
  const userID = req.session.userid;  // get user ID from session
  try {
    const user = await userModel.findById(userID);  // check the user information based on the user ID
    res.render("payment_edit", { user: user });
  } catch (error) {
    console.error("Failed to fetch user name:", error);
    res.render("payment_edit", { user: null, error: 'Fail to get the user name' });
  }
})

app.post('/payment_edit', async (req, res) => {
  const { cardType, cardNumber, cvv, expiryDate } = req.body;
  const userID = req.session.userid;

  const { error } = cardSchema.validate({ cardType, cardNumber, cvv, expiryDate });

  if (error) {
    const errorDetails = error.details.map(detail => {
      let message;
      switch (detail.path[0]) {
        case 'cardType':
          message = 'Card type is required and must be one of Debit, Credit, or Crypto.';
          break;
        case 'cardNumber':
          message = 'Card number must be number and in the format 1111 1111 1111 1111.';
          break;
        case 'cvv':
          message = 'CVV must be a 3-digit number.';
          break;
        case 'expiryDate':
          message = 'Expiry date must be in the format MM/YY, where MM is 01-12 and YY is 24-99.';
          break;
        default:
          message = 'Invalid input data.';
      }
      return {
        field: detail.path[0],
        message: message
      };
    });
    console.error("Validation Error:", errorDetails);
    return res.status(400).json({
      success: false,
      message: "Invalid input data",
      errors: errorDetails
    });
  }

  try {
    const newPayment = new paymentModel({
      userId: userID,
      cardType,
      cardNumber,
      cvv,
      expiryDate
    });
    await newPayment.save();
    res.json({ success: true, message: "Payment information saved successfully!" });
  } catch (error) {
    console.error("Error saving payment information:", error);
    res.status(500).json({ success: false, message: "Failed to save payment information" });
  }
});

// Edit existing payment route
app.get('/old_payment_edit', async (req, res) => {
  const userID = req.session.userid;  // get user ID from session
  try {
    const user = await userModel.findById(userID);  // check the user information based on the user ID
    res.render("old_payment_edit", { user: user });
  } catch (error) {
    console.error("Failed to fetch user name:", error);
    res.render("payment_edit", { user: null, error: 'Fail to get the user name' });
  }
})

app.get('/old_payment_edit/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  // Check if the payment ID is a valid MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    return res.status(400).send('Invalid ID format');
  }

  try {
    const user = await userModel.findById(req.session.userid);
    const payment = await paymentModel.findById(paymentId);
    if (!user) {
      return res.status(401).send("User not found");
    }
    if (!payment) {
      return res.status(404).send('Payment not found');
    }
    res.render("old_payment_edit", { user: user, payment: payment });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).send("Server error");
  }
});

app.post('/update_payment/:paymentId', async (req, res) => {
  const { paymentId } = req.params;
  const { cardType, cardNumber, cvv, expiryDate } = req.body;

  const { error } = cardSchema.validate({ cardType, cardNumber, cvv, expiryDate });

  if (error) {
    const errorDetails = error.details.map(detail => {
      let message;
      switch (detail.path[0]) {
        case 'cardType':
          message = 'Card type is required and must be one of Debit, Credit, or Crypto.';
          break;
        case 'cardNumber':
          message = 'Card number must be number and in the format 1111 1111 1111 1111.';
          break;
        case 'cvv':
          message = 'CVV must be a 3-digit number.';
          break;
        case 'expiryDate':
          message = 'Expiry date must be in the format MM/YY, where MM is 01-12 and YY is 24-99.';
          break;
        default:
          message = 'Invalid input data.';
      }
      return {
        field: detail.path[0],
        message: message
      };
    });
    console.error("Validation Error:", errorDetails);
    return res.status(400).json({
      success: false,
      message: "Invalid input data",
      errors: errorDetails
    });
  }

  try {
    const updatedPayment = await paymentModel.findByIdAndUpdate(paymentId, {
      cardType, cardNumber, cvv, expiryDate
    }, { new: true });

    if (!updatedPayment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({ success: true, message: "Payment information updated successfully", payment: updatedPayment });
  } catch (error) {
    console.error("Failed to update payment information:", error);
    res.status(500).json({ success: false, message: "Error updating payment information" });
  }
});

// Payment List route
app.get('/payment_list', async (req, res) => {
  const userID = req.session.userid;
  try {
    const user = await userModel.findById(userID);
    const payments = await paymentModel.find({ userId: userID });
    res.render("payment_list", { user: user, payments: payments });
  } catch (error) {
    console.error("Failed to fetch user or payment list:", error);
    res.render("payment_list", { user: null, payments: null, error: 'Failed to get the user or payment list' });
  }
});

// Payment Delete route
app.delete('/delete_payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    await paymentModel.findByIdAndDelete(paymentId);
    res.json({ success: true, message: "Payment information deleted successfully!" });
  } catch (error) {
    console.error("Failed to delete payment information:", error);
    res.status(500).json({ success: false, message: "Failed to delete payment information" });
  }
});

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
  // Find user in db
  const user = await userModel.findOne({ username: req.body.username })
    .catch(error => {
      console.log(error)
      return res.render("login", { errorMessage: "Cannot find account" })
    })

  // if user is not found, redirect with error
  if (!user) {
    return res.render("login", { errorMessage: "Cannot find account" })
  }

  // If user is found, compare password given by user and user password in db
  const loggedIn = await bcrypt.compare(req.body.password, user.password)
    .catch(error => {
      console.log(error)
      return res.render('login', { errorMessage: error })
    })
  // If passwords match, redirect to postlogin screen, else redirect to login with error
  if (loggedIn) {
    req.session.userid = user.id
    req.session.email = user.email
    res.redirect("postlogin")
  } else {
    return res.render('login', { errorMessage: "Incorrect password" })
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

// Weather API
app.get('/weather', (req, res) => {
  const cityName = req.query.cityName;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => res.send(data))
    .catch(error => {
      console.error('API request failed', error);
      res.status(500).send('Failed to fetch weather data');
    });
});

// Get available shared routes
app.post('/getAvailableRoutes', async (req, res) => {
  let destinationPoint = req.body.locationEnd;
  const point = [destinationPoint[0], destinationPoint[1]];
  const tileset = 'mapbox.mapbox-streets-v8'; // Mapbox's default tileset ID
  const outerRadius = 2000;
  const innerRadius = 500;

  const outerQuery = `https://api.mapbox.com/v4/${tileset}/tilequery/${point[0]},${point[1]}.json?radius=${outerRadius}&limit=50&access_token=${mapbox_token}`;
  const innerQuery = `https://api.mapbox.com/v4/${tileset}/tilequery/${point[0]},${point[1]}.json?radius=${innerRadius}&limit=45&access_token=${mapbox_token}`;

  Promise.all([fetch(outerQuery), fetch(innerQuery)])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([outerData, innerData]) => {
      const outerFeatures = outerData.features;
      const innerFeatures = innerData.features;

      // Create a set of inner feature IDs for quick lookup
      const innerFeatureIds = new Set(innerFeatures.map(feature => feature.id));

      // Filter out the outer features that are not in the inner features
      const ringFeatures = outerFeatures.filter(feature => !innerFeatureIds.has(feature.id));

      // Create GeoJSON object
      const ringGeoJSON = {
        type: "FeatureCollection",
        features: ringFeatures
      };

      res.send(ringGeoJSON);
    }).catch(error => {
      res.status(500).send('Failed to fetch available routes');
    });

});

// 404 route
app.get('*', (req, res) => {
  res.render("404")
})