async function calculateDistance(start, end) {
  console.log(start, end);
  var from = turf.point(start);
  var to = turf.point(end);
  var distance = turf.distance(from, to);
  sessionStorage.setItem("distance", distance);
  calculatePrices(distance);
  return distance;
}