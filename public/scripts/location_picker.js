
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  $.post('getAddress', { lat: latitude, lng: longitude }, function (data) {
    console.log(data)
  }).fail(function () {
    console.log("error")
  })
}