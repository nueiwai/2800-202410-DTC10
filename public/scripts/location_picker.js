const geolocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(showLocation, showError);
  } else {
    alert('Browser does not support geolocation');
  }
}

const showLocation = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const location = { latitude, longitude };
  console.log(location);
}

const showError = (error) => {
  console.log(error);
}

`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`