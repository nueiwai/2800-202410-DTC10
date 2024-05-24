/**
 * Function to check if the browser supports geolocation and get the current position.
 * Calls showPositionStart if the geolocation is supported.
 * Alerts the user if the geolocation is not supported.
 * @returns {void}
 */
function getCurrentLocationStart() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPositionStart);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}



/**
 * Function to get the current location of the user for starting location
 * @returns {void}
 */
function showPositionStart(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude)
  console.log(longitude)
  let currentStartLocation = [longitude, latitude]
  document.getElementById('current-starting-location').setAttribute('value', currentStartLocation);
  document.querySelector('.start-geocoder>.mapboxgl-ctrl-geocoder>.mapboxgl-ctrl-geocoder--input').setAttribute('value', 'Your Location');
}

/**
 * Function to check if the browser supports geolocation and get the current position.
 * Calls showPositionEnd if the geolocation is supported.
 * Alerts the user if the geolocation is not supported.
 * @returns {void}
 */
function getCurrentLocationEnd() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPositionEnd);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

/**
 * Function to get the current location of the user for ending location
 * @returns {void}
 */
function showPositionEnd(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude)
  console.log(longitude)
  let currentEndLocation = [longitude, latitude]
  document.getElementById('current-destination').setAttribute('value', currentEndLocation);
  document.querySelector('.end-geocoder>.mapboxgl-ctrl-geocoder>.mapboxgl-ctrl-geocoder--input').setAttribute('value', 'Your Location');
}
