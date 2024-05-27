async function calculateDistance(start, end) {
  console.log(start, end);
  var from = turf.point(start);
  var to = turf.point(end);
  var distance = turf.distance(from, to);
  sessionStorage.setItem("distance", distance);
  calculatePrices(distance);
  calculateTime();
  return distance;
}

async function calculateTime() {
  var distance = sessionStorage.getItem("distance");
  var time = distance / (55 / 60);
  sessionStorage.setItem("estimatedDuration", time);
  return time;
}