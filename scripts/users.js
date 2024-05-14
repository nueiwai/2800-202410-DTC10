
const mongoose = require('mongoose');


/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_url = process.env.MONGODB_URL
/* END secret section */

async function main() {
  await mongoose.connect(`mongodb+srv://new-user:gQZDhA4OUENnrrrz@cluster0.08ftvgk.mongodb.net/Dronify`);
  // await mongoose.connect(`mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_url}/${mongodb_database}`);
}

main().catch(err => console.log(err));

const userSchema = new mongoose.Schema({
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
  }
});

const user = mongoose.model('User', userSchema);

module.exports = user