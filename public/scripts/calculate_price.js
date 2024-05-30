/**
 * Calculate the prices of the routes based on the distance and store it in session storage
 * @param {Number} distance 
 * @returns {void}
 */
function calculatePrices(distance) {
  console.log("calculating prices");
  const prices = {
    Small: null,
    Medium: null,
    Large: null
  };

  switch (true) {
    case (distance <= 5):
      prices.Small = 15;
      prices.Medium = 20;
      prices.Large = 30;
      break;
    case (distance <= 10):
      prices.Small = 20;
      prices.Medium = 25;
      prices.Large = 40;
      break;
    case (distance > 10):
      prices.Small = 25;
      prices.Medium = 35;
      prices.Large = 50;
      break;
    default:
      prices.Small = 'Distance not supported';
      prices.Medium = 'Distance not supported';
      prices.Large = 'Distance not supported';
  }

  sessionStorage.setItem("prices", JSON.stringify(prices));
  displayPrices();
  return prices;
}

function calculateSharedPrices(distance, stops) {
  console.log("calculating prices");
  const prices = {
    Small: null,
    Medium: null,
    Large: null
  };

  const percentageOff = stops * 0.05;
  const percentage = 1 - percentageOff;
  switch (true) {
    case (distance <= 5):
      prices.Small = 15 * percentage;
      prices.Medium = 20 * percentage;
      prices.Large = 30 * percentage;
      break;
    case (distance <= 10):
      prices.Small = 20 * percentage;
      prices.Medium = 25 * percentage;
      prices.Large = 40 * percentage;
      break;
    case (distance > 10):
      prices.Small = 25 * percentage;
      prices.Medium = 35 * percentage;
      prices.Large = 50 * percentage;
      break;
    default:
      prices.Small = 'Distance not supported';
      prices.Medium = 'Distance not supported';
      prices.Large = 'Distance not supported';
  }

  sessionStorage.setItem("prices", JSON.stringify(prices));
  displayPrices();
  return prices;
}


/**
 * Calculate the prices for the roadside assistance
 * @returns {void}
 */
function calculateRoadsideAssistancePrices(distance) {
  console.log("calculating prices");
  if (distance <= 5) {
    sessionStorage.setItem("price", 150);
  } else if (distance <= 10) {
    sessionStorage.setItem("price", 200);
  } else {
    sessionStorage.setItem("price", 250);
  }
}


/**
 * Display the prices on the page in the designated elements
 * @returns {void}
 */
function displayPrices() {
  const prices = JSON.parse(sessionStorage.getItem("prices"));
  console.log(prices);

  $("#smallPrice").text(prices.Small);
  $("#mediumPrice").text(prices.Medium);
  $("#largePrice").text(prices.Large);
}


/**
 * Display the price of the battery in the modal
 * @returns {void}
 */
function displayPriceBattery() {
  const price = sessionStorage.getItem("price");
  $("#priceBattery").text(price);
}