/**
 * calculate straight line distance between two points and store it in session storage
 * @param {Array} start 
 * @param {Array} end 
 * @returns {void} 
 */
async function calculateDistance(start, end) {
  console.log(start, end);
  var from = turf.point(start);
  var to = turf.point(end);
  var distance = turf.distance(from, to);
  sessionStorage.setItem("distance", distance);
  calculatePrices(distance);
  calculateTime();
}

/**
 * calculate prices based on distance and store it in session storage
 * @returns {void}
 */
async function calculateTime() {
  var distance = sessionStorage.getItem("distance");
  var time = distance / (55 / 3600);
  sessionStorage.setItem("estimatedDuration", time);
}


/**
 * Calculate distance and duration for shared route
 * @return {void}
 */
async function calculateDistanceAndTimeForDroneShare() {
  let pointsAlongRoute = await getCoordinatesFromNearByDestinations();
  let pointsAlongRouteOrdered = sortByDistance(pointsAlongRoute);
  console.log('Points along route:', pointsAlongRouteOrdered);
  const lineString = turf.lineString(pointsAlongRouteOrdered);
  const length = turf.length(lineString);
  sessionStorage.setItem('estimatedSharedDistance', length);

  const duration = length * 3600 / 50; // slowed speed for more load in seconds
  sessionStorage.setItem('estimatedDuration', duration);

  calculateSharedPrices(length, pointsAlongRouteOrdered.length - 2);
}