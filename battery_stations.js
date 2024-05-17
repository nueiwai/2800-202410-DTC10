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

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});


const batteryStationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: {
    type: String,
    required: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  properties: {
    address: String,
    lot_operator: String,
    geo_local_area: String,
    geo_point_2d: {
      lon: Number,
      lat: Number
    }
  }
}
);


const batteryStation = mongoose.model('battery_station', batteryStationSchema);

module.exports = batteryStation