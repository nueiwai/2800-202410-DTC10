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
  $.post('getAddress', { lat: latitude, lng: longitude }, function (data) {
    let address = data.features[0].properties.full_address
    document.querySelector('.start-geocoder>.mapboxgl-ctrl-geocoder>.mapboxgl-ctrl-geocoder--input').setAttribute('value', 'Your Location');
    console.log(address)
  }).fail(function () {
    console.log("error")
  })
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
  $.post('getAddress', { lat: latitude, lng: longitude }, function (data) {
    let address = data.features[0].properties.full_address
    document.querySelector('.end-geocoder>.mapboxgl-ctrl-geocoder>.mapboxgl-ctrl-geocoder--input').setAttribute('value', 'Your Location');
    console.log(address)
  }).fail(function () {
    console.log("error")
  })
}
