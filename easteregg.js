require('dotenv').config();
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const cors = require("cors");

app.use(cors());

app.listen(4000, () => {
  console.log("Listening to port 4000");
});

app.get("/getWeatherOfACityByName", (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY; // Use the API key from the environment variable
  const cityName = req.query.cname;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching weather:', error);
      res.status(500).send('Error fetching weather data');
    });
});
