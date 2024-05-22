
function getCurrentLocationStart() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude)
  console.log(longitude)
  $.post('getAddress', { lat: latitude, lng: longitude }, function (data) {
    let address = data.features[0].properties.full_address
    document.getElementById("starting-location").value = address
  }).fail(function () {
    console.log("error")
  })
}


function getCurrentLocationEnd() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude)
  console.log(longitude)
  $.post('getAddress', { lat: latitude, lng: longitude }, function (data) {
    let address = data.features[0].properties.full_address
    document.getElementById("destination").value = address
  }).fail(function () {
    console.log("error")
  })
}


// function getCurrentLocationEnd() {
//   if ("geolocation" in navigator) {
//     let options = {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 10000
//     };

//     let successCallback = (position) => {
//       let latitude = position.coords.latitude;
//       let longitude = position.coords.longitude;
//       let accuracy = position.coords.accuracy;
//       let timestamp = position.timestamp;

//       console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters (Timestamp: ${new Date(timestamp)})`);
//       $.post('getAddress', { lat: latitude, lng: longitude }, function (data) {
//         console.log(data)
//       }).fail(function () {
//         console.log("error")
//       })
//     };

//     let errorCallback = (error) => {
//       console.error(`Error getting location: ${error.code} - ${error.message}`);
//     };

//     let watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);

//     // Store the watchId to stop watching later if needed
//     // navigator.geolocation.clearWatch(watchId);
//   } else {
//     console.error("Geolocation is not supported by this browser.");
//   }
// }
