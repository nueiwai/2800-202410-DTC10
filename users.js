const mongoose = require('mongoose');
require('dotenv').config()


/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
/* END secret section */

async function main() {
  await mongoose.connect(`mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}`);
}

main().catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phonenumber: {
    type: String
  },
  street: {
    type: String
  },
  city: {
    type: String
  },
  postal: {
    type: String
  },
  profileImageUrl: {
    type: String
  }
});

const user = mongoose.model('User', userSchema);

const paymentSchema = new mongoose.Schema({
  cardType: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const payment = mongoose.model('Payment', paymentSchema);

module.exports = { user, payment };