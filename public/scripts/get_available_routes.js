async function fetchAvailableSharedRoutes() {
  const destinationPoint = window.destination
  console.log('Destination point in client js:', destinationPoint)
  fetch('/getAvailableRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ destinationPoint })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Available routes:', data);
    })
    .catch(error => {
      console.error('Error fetching routes:', error);
    });
}