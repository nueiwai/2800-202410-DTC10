var locationStart = null;
var locationEnd = null;

/**
 * Set Variables for drone share
 * @returns {void}
 */
function setVariables() {
  const startLocationManual = window.manualStartLocation
  const destinationManual = window.manualEndLocation
  const startLocationMapbox = window.mapboxStartLocation
  const destinationMapbox = window.window.mapboxDestination
  console.log('Start location manual:', startLocationManual)
  console.log('Destination manual:', destinationManual)
  console.log('Start location mapbox:', startLocationMapbox)
  console.log('Destination mapbox:', destinationMapbox)

  if (typeof startLocationManual !== 'undefined' && startLocationManual !== null) {
    locationStart = startLocationManual
  } else if (typeof startLocationMapbox !== 'undefined' && startLocationMapbox !== null) {
    locationStart = startLocationMapbox
  }
  console.log('Start location:', locationStart)

  if (typeof destinationManual !== 'undefined' && destinationManual !== null) {
    locationEnd = destinationManual
  } else if (typeof destinationMapbox !== 'undefined' && destinationMapbox !== null) {
    locationEnd = destinationMapbox
  }
  console.log('Destination location:', locationEnd)
}

/**
 * Fetch available shared routes from the server
 * @returns {Promise<void>}
 */
async function fetchAvailableSharedRoutes() {
  console.log('Destination point in client js:', locationEnd)
  fetch('/getAvailableRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ locationEnd })
  })
    .then(response => response.json())
    .then(data => {
      reformatMapboxResponse(data)
    })
    .catch(error => {
      console.error('Error fetching routes:', error);
    });
}

/**
 * Reformat the response from Mapbox API to the required structure
 * @returns {Promise<void>}
 */
function reformatMapboxResponse(response) {
  // Check if the response has the required structure
  if (!response || response.type !== "FeatureCollection" || !Array.isArray(response.features)) {
    throw new Error("Invalid response object");
  }

  // Create a new geojson object with the required structure
  const reformattedResponse = {
    type: "FeatureCollection",
    features: response.features.map(feature => ({
      type: feature.type,
      geometry: feature.geometry,
      properties: {
        short_name: feature.text,
        full_address: feature.place_name
      }
    }))
  };

  markAvailableSharedRoutesOnMap(reformattedResponse);
  return reformattedResponse;
}

/**
 * Mark the available shared routes on the map
 * @param {Object} availableRoutes The available routes to mark on the map
 * @returns {void}
 */
function markAvailableSharedRoutesOnMap(availableRoutes) {
  // Check if the availableRoutes object has the required structure
  if (!availableRoutes || availableRoutes.type !== "FeatureCollection" || !Array.isArray(availableRoutes.features)) {
    throw new Error("Invalid availableRoutes object");
  }

  // Clear the map of any existing markers
  clearMap();

  // Add markers for each available route
  availableRoutes.features.forEach(route => {
    const marker = new mapboxgl.Marker(
      {
        color: "#FF0000",
        draggable: false,
      }
    )
      .setLngLat(route.geometry.coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(route.properties.full_address))
      .addTo(map);
  });

  // Fit the map to the bounds of the available routes
  const bounds = new mapboxgl.LngLatBounds();
  availableRoutes.features.forEach(route => {
    bounds.extend(route.geometry.coordinates);
  });
  map.fitBounds(bounds, { padding: 50 });
}

function clearMap() {
  // Remove all markers from the map
  const markers = document.querySelectorAll(".mapboxgl-marker");
  markers.forEach(marker => marker.remove());
}