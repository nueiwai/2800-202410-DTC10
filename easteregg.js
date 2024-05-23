const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors()); // disable cross-origin resource sharing

app.listen(4000, () => {
  console.log("Listening to port 4000");
});

app.get("/getWeatherOfACityByName", (req, res) => {
  x = undefined;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${req.query.cname}&appid=3ed62c84c7c7d06a4a597ed4541fcf4f&units=metric`
  )
    .then((resp) => resp.json())
    .then((resp) => {
      res.json(resp);
    });
});