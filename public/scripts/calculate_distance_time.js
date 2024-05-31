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


/**
 * Timer for the delivery processes
 * @returns {void}
 */
function updateTimer() {
  const startingSeconds = parseInt(sessionStorage.getItem("estimatedDuration"), 10);
  let timeRemaining = startingSeconds;
  const timerElement = document.getElementById("estimatedTime");

  function update() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (timeRemaining > 0) {
      timeRemaining--;
    } else {
      clearInterval(timer);
      setTimeout(() => {
        timerElement.textContent = "00:00";
        window.location.href = "/postlogin";
      }, 2000);
    }
  }

  update();
  const timer = setInterval(update, 1000); // Update every second
}