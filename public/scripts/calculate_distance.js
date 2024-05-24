async function calculateDistance(start, end) {
  console.log(start, end);
  var from = turf.point(start);
  var to = turf.point(end);
  // var options = { units: 'kilometers' };
  var distance = turf.distance(from, to);
  console.log(distance);
  return distance;
}