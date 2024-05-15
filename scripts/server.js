const express = require('express')
const app = express()
const port = 3001
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
app.use(express.static("scripts"));
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
  console.log(req.session.userid)
})

app.get('/signup', (req, res) => {
  res.render("signup")
})

app.post('/signup', async (req, res) => {
  const newUser = await new userModel({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  req.session.userid = newUser.id
  await newUser.save()
  res.redirect("postlogin")
})

app.get('/login', (req, res) => {
  res.render("login")
})

app.post('/login', async (req, res) => {
  const user = await userModel.findOne({email: req.body.email})
  const isAuth = await bcrypt.compare(req.body.password, user.password)
  if (isAuth){
    req.session.userid = user.id
    return res.redirect("postlogin")
  }
  else {
    res.redirect("/")
  }
})

app.get('/postlogin', (req, res) => {
  res.render("postlogin")
})

app.post('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})






