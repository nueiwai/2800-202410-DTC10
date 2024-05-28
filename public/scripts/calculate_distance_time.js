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