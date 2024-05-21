function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  // post coordinates to server
  $.post('/get_address', { latitude: lat, longitude: lng }, function (data) {
    console.log(data)
    $("#starting-location").val(data)
  })
}