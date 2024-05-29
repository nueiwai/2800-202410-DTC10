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
 * @returns {Promise<Object>} Reformatted Mapbox response
 */
async function fetchAvailableSharedRoutes() {
  console.log('Destination point in client js:', locationEnd);
  try {
    const response = await fetch('/getAvailableRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ locationEnd })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const reformattedMapboxResponse = reformatMapboxResponse(data);
    return reformattedMapboxResponse;
  } catch (error) {
    console.error('Error fetching routes:', error);
  }
}

/**
 * Reformat the response from Mapbox API to the required structure
 * @param {Object} response - The response from Mapbox API
 * @returns {Object} Reformatted response
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
        name: feature.properties.name,
        place_type: feature.properties.category_en
      }
    }))
  };

  // Mark the available shared routes on the map
  markAvailableSharedRoutesOnMap(reformattedResponse);

  return reformattedResponse; // Return the reformatted response
}

/**
 * Mark starting location on the map
 * @returns {void}
 */
function markStartingLocationOnMap(locationStart) {

  // Add a marker for the starting location
  const marker = new mapboxgl.Marker(
    {
      color: "#31B6C0",
      draggable: false,
    }
  )
    .setLngLat(locationStart)
    .addTo(map);
}

/**
 * Mark final destination on the map
 * @returns {void}
 */
function markDestinationOnMap(locationEnd) {

  // Add a marker for the final destination
  const marker = new mapboxgl.Marker(
    {
      color: "#074464",
      draggable: false,
    }
  )
    .setLngLat(locationEnd)
    .addTo(map);
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

  // Mark the starting location on the map
  markStartingLocationOnMap(locationStart);

  // Mark the final destination on the map
  markDestinationOnMap(locationEnd);

  // Add markers for each available route
  availableRoutes.features.forEach(route => {
    const marker = new mapboxgl.Marker({
      color: "#FF0000",
      draggable: false,
    }).setLngLat(route.geometry.coordinates).addTo(map); // Add marker to the map
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


//get coordinates of formatted mapbox response
async function getCoordinatesFromNearByDestinations() {
  let reformattedMapboxResponse = await fetchAvailableSharedRoutes();
  let sharedRouteCoordinates = reformattedMapboxResponse.features.map(feature => feature.geometry.coordinates);
  sharedRouteCoordinates.unshift(locationStart);
  sharedRouteCoordinates.push(locationEnd);
  console.log('Shared route coordinates after adding:', sharedRouteCoordinates);
  return sharedRouteCoordinates;
}


async function drawSharedRoute() {
  // Get the coordinates of the shared routes
  const sharedRouteCoordinates = await getCoordinatesFromNearByDestinations();

  if (sharedRouteCoordinates.length > 2) {
    // Draw the route on the map
    const polylineCoordinates = [];
    for (let i = 0; i < sharedRouteCoordinates.length - 1; i++) {
      let start = sharedRouteCoordinates[i];
      let end = sharedRouteCoordinates[i + 1];
      polylineCoordinates.push(start, end);
    }

    // Draw the polyline on the map
    drawPolyline(polylineCoordinates);
  }

  function drawPolyline(coordinates) {
    const polylineGeojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      }]
    };

    // Update or add the polyline to the map
    if (map.getSource('line-polyline')) {
      map.getSource('line-polyline').setData(polylineGeojson);
    } else {
      map.addSource('line-polyline', {
        type: 'geojson',
        data: polylineGeojson
      });
      map.addLayer({
        id: 'line-polyline',
        type: 'line',
        source: 'line-polyline',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#31B6C0',
          'line-width': 4
        }
      });
    }
    let lengthSharedRoute = turf.length(polylineGeojson, { units: 'kilometers' });
    console.log('Length of shared route:', lengthSharedRoute);
    let estimatedDurationSharedRoute = lengthSharedRoute * 60 / 50;
    console.log('Estimated duration of shared route:', estimatedDurationSharedRoute); // 50 km/h is the average speed of a drone
  }
}

/**
 * Append information into available shared routes card
 * 
 */
function appendSharedRoutesInfo() {
  let sharedRoutesCard = document.getElementById('availableRoutes');
  let sharedRouteOption = document.getElementById('availableRoutesContainer');
  let reformattedMapboxResponse = fetchAvailableSharedRoutes();
  let sharedRoutes = reformattedMapboxResponse.features;

  if (sharedRoutes.length < 1) {
    console.log('No shared routes available');
    sharedRoutesCard.innerHTML = '<p class="text-center font-semibold">No shared routes available</p>';
    return;
  } else {
    let sharedRouteCount = sharedRoutes.length;
    sharedRouteOption.innerHTML = `<button class="flex container gap-6 py-2 px-4 rounded-lg bg-buttonBg focus:ring-2 ring-white">
      < div class="flex items-center m-2 w-[48px] h-[48px] max-w-[48px] max-h-[48px] justify-start" >
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
          <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
        </svg>
      </div >
      <div class="flex container flex-col gap-2">
        <div class="font-medium text-center text-white">Estimated Duration:</div>
        <div id="estimatedDurationShare" class="font-medium text-center text-white"></div>
      </div>
    </button > `
  };
}