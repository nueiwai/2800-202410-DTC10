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
  }, 1250);
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
    drawBatteryRoute(endCoordinates, startCoordinates);
    $("#mainMenuCard").hide()
    $("#availableBatteriesCard").show()
    $("#availableBatteriesCard").addClass("transition ease-in duration-300 transform translate-x-0")
  }, 3400);

  endLocation = endCoordinates

  map.flyTo({
    center: endCoordinates,
    zoom: 12.7, // optimal zoom so that on average the closet three stations are within frame
  });
}

async function drawBatteryRoute(startLocation, endLocation) {

  // Check if start and end locations are defined, then plot the points
  if (startLocation && endLocation) {
    setTimeout(() => {
      map.flyTo({
        center: startLocation,
        zoom: 18,
      });

      setTimeout(() => {
        map.flyTo({
          center: endLocation,
          zoom: 18,
        });

        setTimeout(() => {
          drawArc(startLocation, endLocation);
          map.flyTo({
            center: [(startLocation[0] + endLocation[0]) / 2, (startLocation[1] + endLocation[1]) / 2],
            zoom: ((startLocation[0] + endLocation[0]) / 2, (startLocation[1] + endLocation[1]) / 2) * 0.3,
          });


          drawShadow(startLocation, endLocation);
        }, 1600);
      }, 1300);
    }, 200)
  } else {
    console.alert("Please enter a starting location and destination.");
  }
}


/**
 * Draw a curved arc between the start and end location points
 * @param {Array} start - The start location coordinates
 * @param {Array} end - The end location coordinates
 *
 * This line-arc block of code was adapted from code found here:
 * source: https://www.youtube.com/watch?v=VNVmlWv4gdQ
 */
function drawArc(start, end) {
  // First calculate the distance between start and end location points
  const distance = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));

  // Calculate the midpoint between the start and end location points
  const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];

  // Next, offset the midpoint to create a control point for the curve arc
  // We need to adjust the offset proportionally to the distance to avoid steep curves for short distances
  const controlPoint = [midpoint[0], midpoint[1] + 0.7 * distance]; // Set multiplier to 0.7

  const steps = 100;
  const arcCoordinates = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * controlPoint[0] + t * t * end[0];
    const y = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * controlPoint[1] + t * t * end[1];
    arcCoordinates.push([x, y]);
  }
  const arcGeojson = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: arcCoordinates
      }
    }]
  };
  if (map.getSource('line-arc')) {
    map.getSource('line-arc').setData(arcGeojson);
  } else {
    map.addSource('line-arc', {
      type: 'geojson',
      data: arcGeojson
    });
    map.addLayer({
      id: 'line-arc',
      type: 'line',
      source: 'line-arc',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#31B6C0',
        'line-width': 4,
        'line-dasharray': [2, 2]
      }
    });
  }
}

/** 
 * Draw a straight line that simulates a shadow between the start and end location points 
 * @param {Array} start - The start location coordinates
 * @param {Array} end - The end location coordinates
 */
function drawShadow(start, end) {
  const lineGeojson = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [start, end]
      }
    }]
  } // Add the shadow 
  if (map.getSource('line-shadow')) {
    map.getSource('line-shadow').setData(lineGeojson);
  } else {
    map.addSource('line-shadow', {
      type: 'geojson',
      data: lineGeojson
    });
    map.addLayer({
      id: 'line-shadow',
      type: 'line',
      source: 'line-shadow',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#929090', // Shadow colour 
        'line-width': 6, // Shadow width 
        'line-opacity': 0.5 // Shadow opacity 
      }
    });
  }
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