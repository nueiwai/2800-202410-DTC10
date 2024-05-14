const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
const bcrypt = require('bcrypt')
const ejs = require('ejs');
const userModel = require('./users')
const MongoStore = require('connect-mongo');
const cors = require('cors')

require('dotenv').config();

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
/* END secret section */


// Create database connection to use as the store option in the session object below
const db = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}`
})

// Express application setup
app.set('view engine', 'ejs');
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src"));
app.use(session({
  secret: bcrypt.hashSync(`${mongodb_session_secret}`, 10),
  resave: false,
  saveUninitialized: false,
  store: db,
  credentials: 'include',
  unset: 'destroy',
  cookie: { secure: false, maxAge: 3600000 }
}))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/', async (req, res) => {
  res.render("index")
})

// app.post('/newuser', async (req, res) => {
//   const randomEmail = Math.floor(Math.random() * 101);
//   const randomPW = Math.floor(Math.random() * 100001);
//   const test = await new userModel({ name: "testing", email: `${randomEmail}@gmail.com`, password: `${randomPW}`, })
//   await test.save()
//   res.send("user saved")
// })

app.get('/signup', (req, res) => {
  res.render("signup")
})

app.get('/login', (req, res) => {
  res.render("login")
})






