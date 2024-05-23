function getCurrentLocationStart() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPositionStart);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPositionStart(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude)
  console.log(longitude)
  let currentStartLocation = [longitude, latitude]
  sessionStorage.setItem('currentStartLocation', JSON.stringify(currentStartLocation));
  document.querySelector('.start-geocoder>.mapboxgl-ctrl-geocoder>.mapboxgl-ctrl-geocoder--input').setAttribute('value', 'Your Location');
}

function getCurrentLocationEnd() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPositionEnd);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPositionEnd(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude)
  console.log(longitude)
  let currentEndLocation = [longitude, latitude]
  sessionStorage.setItem('currentEndLocation', JSON.stringify(currentEndLocation));
  document.querySelector('.end-geocoder>.mapboxgl-ctrl-geocoder>.mapboxgl-ctrl-geocoder--input').setAttribute('value', 'Your Location');
}
