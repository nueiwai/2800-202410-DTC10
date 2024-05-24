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


function displayPrices() {
  console.log("displaying prices");
  const prices = JSON.parse(sessionStorage.getItem("prices"));
  console.log(prices);

  $("#smallPrice").text(prices.Small);
  $("#mediumPrice").text(prices.Medium);
  $("#largePrice").text(prices.Large);
}