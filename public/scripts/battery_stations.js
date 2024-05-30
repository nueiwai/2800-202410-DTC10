function addBatteryStations() {
  // add markers to map
  let geojson = window.batteryStations;
  for (const feature of geojson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';
    const popup = new mapboxgl.Popup({
      offset: 25
    }).setHTML(
      '<div class="text-md p-4 bg-white rounded-lg shadow-md text-center text-gray-800"><button onclick="displayAvailableBattery()" class="inline-block px-4 py-2 bg-buttonBg text-white rounded-md transition-colors">Select this station</button>'
    );

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat(feature.location.coordinates)
      .setPopup(popup) // set a popup on this marker
      .addTo(map);
  }
}

//Display the current location of the battery getter on the map with a point
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
}