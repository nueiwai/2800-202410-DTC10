/**
 * Function to add battery stations to the map
 * @returns {void}
 */
function renderBatteryStations() {
  let geojson = window.batteryStations
  geojson.features.forEach(point => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker(el).setLngLat(point.location.coordinates)
      .addTo(map);

    var bounds = new mapboxgl.LngLatBounds();

    geojson.features.forEach(function (feature) {
      bounds.extend(feature.location.coordinates);
    });

    map.fitBounds(bounds, {
      padding: 100,
      pitch: 44
    });

  })
}


/**
 * Function to plot the current location of the battery getter on the map
 * @param {Array} currentBatteryGetterLocation - The current location of the battery getter
 * @returns {void}
 */
function plotCurrentLocationOfBatteryGetter(currentBatteryGetterLocation) {
  const marker = new mapboxgl.Marker(
    {
      color: "#31B6C0",
      draggable: false,
    }
  )
    .setLngLat(currentBatteryGetterLocation)
    .addTo(map);

  map.flyTo({
    center: currentBatteryGetterLocation,
    zoom: 12.7, // optimal zoom so that on average the closet three stations are within frame
  });

  setTimeout(() => {
    findNearestPoints(currentBatteryGetterLocation);
  }, 500);
}


/**
 * Function to display the nearest three battery stations to the user
 * @param {Array} userLocation - The current location of the user
 * @returns {void}
 */
function findNearestPoints(userLocation) {
  let geojson = window.batteryStations

  $(".marker").each(function () {
    $(this).remove()
  })

  let targetPoint = turf.point(userLocation);

  const turfPoints = geojson.features.map(feature => {
    return turf.point(feature.location.coordinates);
  });

  const turfCollection = turf.featureCollection(turfPoints);

  // Calculate distances between userLocation and each point
  const distances = turfPoints.map(point => {
    return {
      point: point,
      distance: turf.distance(targetPoint, point)
    };
  });

  // Sort points by distance
  distances.sort((a, b) => a.distance - b.distance);

  // Get the 3 nearest points
  const nearestPoints = distances.slice(0, 3).map(item => item.point);

  nearestPoints.forEach(nearestPoint => {
    const el = document.createElement('div');
    el.className = 'marker';
    const popup = new mapboxgl.Popup({
      offset: 25
    }).setHTML(
      `<button lon-data="${nearestPoint.geometry.coordinates[0]}" lat-data="${nearestPoint.geometry.coordinates[1]}" class="inline-block px-4 py-2 bg-buttonBg text-white rounded-md transition-colors" onclick="selectBatteryStation(event)">Select this station</button>`
    );

    new mapboxgl.Marker(el).setLngLat(nearestPoint.geometry.coordinates)
      .setPopup(popup)
      .addTo(map);
  });

  // Adjust map view to include the nearest points
  const bounds = new mapboxgl.LngLatBounds();
  nearestPoints.forEach(nearestPoint => {
    bounds.extend(nearestPoint.geometry.coordinates);
  });

  map.fitBounds(bounds, {
    padding: 100,
    pitch: 44
  });
}


/**
 * Function to run when user select a battery station, calculates distance and price
 * @returns {void}
 */
function selectBatteryStation(event) {
  const long = parseFloat(event.target.getAttribute("lon-data"))
  const lat = parseFloat(event.target.getAttribute("lat-data"))
  const endCoordinates = [long, lat]
  const startCoordinatesStr = sessionStorage.getItem("currentLocationBatteryGetter")
  const startCoordinates = startCoordinatesStr.split(",").map(coord => parseFloat(coord))


  //finding distance between the two points
  var from = turf.point(startCoordinates);
  var to = turf.point(endCoordinates);
  var distance = turf.distance(from, to);
  sessionStorage.setItem("distance", distance);

  calculateRoadsideAssistancePrices(distance);
  calculateTime();
  displayPriceBattery();
  displayTimeBatteryStation();

  setTimeout(() => {
    $("#mainMenuCard").hide()
    $("#availableBatteriesCard").show()
    $("#availableBatteriesCard").addClass("transition ease-in duration-300 transform translate-x-0")
  }, 500);

  endLocation = endCoordinates


  map.flyTo({
    center: endCoordinates,
    zoom: 12.7, // optimal zoom so that on average the closet three stations are within frame
  });
}


/**
 * Clear the map of all markers, popups
 * @returns {void}
 */
function clearMarkers() {
  $(".marker").each(function () {
    $(this).remove()
  })

  $(".mapboxgl-marker").each(function () {
    $(this).remove()
  })

  $(".mapboxgl-popup").each(function () {
    $(this).remove()
  })
}