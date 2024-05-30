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

/**
 * Function to check if the browser supports geolocation and get the current position of the battery getter.
 * Calls showPositionBattery if the geolocation is supported.
 * Alerts the user if the geolocation is not supported.
 * @returns {void}
 */
function getCurrentLocationBattery() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPositionBattery);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

/**
 * Function to get the current location of the user for battery getter location
 * @returns {void}
 */
function showPositionBattery(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude)
  console.log(longitude)
  let currentBatteryGetterLocation = [longitude, latitude]
  // This function is in the battery stations.js file
  plotCurrentLocationOfBatteryGetter(currentBatteryGetterLocation);
}


/**
 * Function to get the addresses from the user input and store them in the session storage
 * @returns {void}
 */
function getConfirmationAddress() {
  let startAddress = document.querySelector('.start-geocoder>.mapboxgl-ctrl-geocoder>.mapboxgl-ctrl-geocoder--input').value;
  sessionStorage.setItem('startAddress', startAddress);
  let endAddress = document.querySelector('.end-geocoder>.mapboxgl-ctrl-geocoder>.mapboxgl-ctrl-geocoder--input').value;
  sessionStorage.setItem('endAddress', endAddress);
}

/**
 * Predicate function to check if the user entered a valid location or left the input field empty
 * Alerts the user if the location field is empty
 * @returns {boolean}
 */
function isLocationEmpty() {
  let startingLocation = document.querySelector('.start-geocoder>.mapboxgl-ctrl-geocoder>.mapboxgl-ctrl-geocoder--input').value;
  let endingLocation = document.querySelector('.end-geocoder>.mapboxgl-ctrl-geocoder>.mapboxgl-ctrl-geocoder--input');
  if (startingLocation === null || startingLocation === "" || endingLocation === null || endingLocation === "") {
    alert("Please don't leave the location fields empty and enter valid locations");
    return false;
  }
  return true;
}

/**
 * Function to append the starting and ending addresses to the confirmation modal
 * @returns {void}
 */
function appendAddresses() {
  let startAddress = sessionStorage.getItem('startAddress');
  let endAddress = sessionStorage.getItem('endAddress');
  document.getElementById('startAddress').textContent = startAddress;
  document.getElementById('endAddress').textContent = endAddress;
}