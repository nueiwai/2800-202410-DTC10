// main menu drawer ids
let mainMenuDrawer = $("#main-menu-drawer")
let mainMenuControl = $("#mainMenuControl")
let mainMenuCard = $("#mainMenuCard")

// main menu drawer buttons
let directDeliveryBtn = $("#directDeliveryBtn")
let roadsideAssistanceBtn = $("#roadsideAssistanceBtn")
let droneShareBtn = $("#droneShareBtn")

// location modal ids
let locationModal = $("#deliveryLocationModal")
let confirmLocationBtn = $("#confirmBtn")

// Common button and componesnts ids
// select package size ids
let packageSizeOptions = $("#packageSizeOptions")
let selectSizeNextBtn = $("#selectSizeNextBtn")

// payment methods ids
let paymentMethods = $("#paymentMethods")
let cardContainer = $("#availableCards")
let paymentMethodNextBtn = $("#paymentMethodNextBtn")

// confirmation menu ids
let confirmationMenuContainer = $("#confirmationCard")

//Feature specific components
// drone share components
let availableSharedRoutes = $("#availableRoutes")

// road side assistance components
let availableBatteryCard = $("#availableBatteriesCard")
let getLocationBatteryBtn = $("#getLocationBatteryBtn")

/**
 * Clear session storage
 * @returns {void}
 */
function clearSessionStorage() {
    sessionStorage.clear()
}

// Set the session storage for the selected feature - Direct Delivery
directDeliveryBtn.click(() => {
    clearSessionStorage()
    getLocationBatteryBtn.hide()
    clearMarkers()
    locationModal.show()
    sessionStorage.setItem("feature", "direct")
})

// Set the session storage for the selected feature - Drone Share
droneShareBtn.click(() => {
    clearSessionStorage()
    getLocationBatteryBtn.hide()
    clearMarkers()
    locationModal.show()
    sessionStorage.setItem("feature", "share")
})

// Set the session storage for the selected feature - Roadside Assistance
roadsideAssistanceBtn.click(() => {
    clearSessionStorage()
    sessionStorage.setItem("feature", "roadside")
    renderBatteryStations()
    getLocationBatteryBtn.show()
})

/**
 * Close location modal(hide) when user click the cross button
 * @returns {void}
 */
function closeLocationModal() {
    locationModal.hide()
    document.querySelector("body > div[modal-backdrop]")?.remove()
}

//Unhide the package size options and hide the location modal 
//when user clicks the confirmation button 
//after checking if the location fields are empty
confirmLocationBtn.click(() => {
    let locationfields = isLocationEmpty();
    if (locationfields) {
        setTimeout(() => {
            // Remove mainMenuCard 
            mainMenuCard.addClass("transition ease-in duration-300 transform translate-x-0")

            // Hide Location Modal
            locationModal.hide()
            document.querySelector("body > div[modal-backdrop]")?.remove()

            // Hide mainMenuCard
            mainMenuCard.hide()
        }, 400);

        if (sessionStorage.getItem("feature") === "direct") {
            setTimeout(() => {
                // Show packageSizeOptions
                drawRoute().then(() => {
                    calculateDistance(startLocation, endLocation);
                    getConfirmationAddress();
                    packageSizeOptions.show()
                    packageSizeOptions.addClass("transition ease-out duration-500 transform translate-x-0")
                }, 600);
            });

        } else if (sessionStorage.getItem("feature") === "share") {
            setTimeout(() => {
                async function waitForFunctions() {
                    await Promise.all([fetchAvailableSharedRoutes(), drawSharedRoute(), appendSharedRoutesInfo(), calculateDistanceAndTimeForDroneShare()]);
                }
                waitForFunctions().then(() => {
                    getConfirmationAddress();
                    displayTimeRoutes()
                    availableSharedRoutes.show();
                    availableSharedRoutes.addClass("transition ease-out duration-500 transform translate-x-0")
                });
            }, 500);
            // }
        }
    }
});

/**
 * Reload the page if the user clicks the cancel button of available shared routes card
 * @returns {void}
 */
function availableSharedRoutesCancel() {
    location.reload()
}

/**
 * Hide the available Shared Routes and show the package size options
 * @returns {void}
 */
function availableSharedRoutesNext() {
    if (!sessionStorage.getItem("selectedRoute")) {
        alert("Please select the route")
        return
    } else {
        setTimeout(() => {
            availableSharedRoutes.addClass("transition ease-in duration-400 transform translate-x-0")
            availableSharedRoutes.hide()
            packageSizeOptions.show()
            packageSizeOptions.addClass("transition ease-out duration-400 transform translate-x-0")
        }, 800);
    }
}

// Hide the package size options and show the payment methods when the user clicks the next button
selectSizeNextBtn.click(() => {
    if (!sessionStorage.getItem("pkgSize")) {
        alert("Please select a package size")
        return
    } else {
        setTimeout(() => {
            packageSizeOptions.addClass("transition ease-in duration-400 transform translate-x-0")
            packageSizeOptions.hide();
            getCardsAndAppendToModal()
            paymentMethods.show()
            paymentMethods.addClass("transition ease-out duration-400 transform translate-x-0")
        }, 800);
    }
});

/**
 * Reload the page and clear pkgSize session storage key when the user clicks the cancel button
 * @returns {void}
 */
function selectPackageSizeCancel() {
    sessionStorage.removeItem("pkgSize");
    if (sessionStorage.getItem("feature") === "direct") {
        location.reload();
    } else if (sessionStorage.getItem("feature") === "share") {
        setTimeout(() => {
            packageSizeOptions.addClass("transition ease-in duration-400 transform translate-x-0")
            packageSizeOptions.hide()
            availableSharedRoutes.show()
            availableSharedRoutes.addClass("transition ease-out duration-400 transform translate-x-0")
        }, 800);
    }
}

// Hide the payment methods and show confirmation card when the user clicks the next button
paymentMethodNextBtn.click(() => {
    if (!sessionStorage.getItem("paymentMethod")) {
        alert("Please select a payment method")
        return
    } else {
        setTimeout(() => {
            paymentMethods.addClass("transition ease-in duration-400 transform translate-x-0")
            paymentMethods.hide()

        }, 400);

        appendAddresses();
        displayTimeConfirm();
        setTimeout(() => {
            confirmationMenuContainer.show()
            let totalDuration = sessionStorage.getItem('estimatedDuration');
            let eachDuration = parseFloat(totalDuration) / 4;
            animateComponents(totalDuration, eachDuration)
            confirmationMenuContainer.addClass("transition ease-out duration-400 transform translate-x-0")
        }, 400);
    }
});

/**
 * Unhide the package size options and hide the payment methods when the user clicks the cancel button
 * @returns {void}
 */
function selectPaymentCancel() {
    setTimeout(() => {
        sessionStorage.removeItem("paymentMethod")
        paymentMethods.addClass("transition ease-in duration-400 transform translate-x-0")
        paymentMethods.hide()
        if (sessionStorage.getItem("feature") === "direct") {
            packageSizeOptions.show()
            packageSizeOptions.addClass("transition ease-out duration-400 transform translate-x-0")
        } else if (sessionStorage.getItem("feature") === "share") {
            packageSizeOptions.show()
            packageSizeOptions.addClass("transition ease-out duration-400 transform translate-x-0")
        } else if (sessionStorage.getItem("feature") === "roadside") {
            availableBatteryCard.show()
            sessionStorage.removeItem("batteryOption")
            availableBatteryCard.addClass("transition ease-out duration-400 transform translate-x-0")
        }
    }, 800);
}

/**
 * hide bottom main menu card and show available battery info
 * @returns {void}
 */
function displayAvailableBattery() {
    let coordinate = this.id
    // let coordsStr = coordinate.split(",")
    // let coords = [parseFloat(coordsStr[0]), parseFloat(coordsStr[1])]
    sessionStorage.setItem("batteryStationLocation", coordinate)

    mainMenuCard.hide()
    console.log("show available battery card")
    availableBatteryCard.show()
}


function batteryOptionSelect(event) {
    sessionStorage.setItem("batteryOption", event.currentTarget.id)
}



function availableBatteryCancel() {
    clearMarkers();
    sessionStorage.clear();
    availableBatteryCard.removeClass("transition ease-in duration-400 transform translate-x-0")
    availableBatteryCard.addClass("transition ease-out duration-400 transform translate-x-0")
    getLocationBatteryBtn.hide()
    availableBatteryCard.hide()
    mainMenuCard.show()
    mainMenuCard.addClass("transition ease-in duration-400 transform translate-x-0")
}

/**
 * Hide the available battery card and show the payment methods when the user clicks the next button
 * @returns {void}
 */
function availableBatteryNext() {
    if (!sessionStorage.getItem("batteryOption")) {
        alert("Please select the battery station")
        return
    } else {
        setTimeout(() => {
            availableBatteryCard.addClass("transition ease-in duration-400 transform translate-x-0")
            availableBatteryCard.hide()
            getCardsAndAppendToModal()
            paymentMethods.show()
            mainMenuCard.removeClass("transition ease-in duration-400 transform translate-x-0")
            paymentMethods.addClass("transition ease-out duration-400 transform translate-x-0")
        });
    }
}


function validateForm(event) {
    event.preventDefault();

    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/g;
    const errorMessageElement = document.getElementById('error-message');

    const username = document.querySelector('input[name="username"]') ? document.querySelector('input[name="username"]').value : null;
    const name = document.querySelector('input[name="name"]') ? document.querySelector('input[name="name"]').value : null;
    const password = document.querySelector('input[name="password"]') ? document.querySelector('input[name="password"]').value : null;
    const confirmPassword = document.querySelector('input[name="confirm-password"]') ? document.querySelector('input[name="confirm-password"]').value : null;

    let errorMessage = '';

    if (username && specialCharacters.test(username)) {
        errorMessage = 'Special characters are not allowed in Username.';
    } else if (name && specialCharacters.test(name)) {
        errorMessage = 'Special characters are not allowed in First Name.';
    } else if (specialCharacters.test(password)) {
        errorMessage = 'Special characters are not allowed in Password.';
    } else if (confirmPassword && specialCharacters.test(confirmPassword)) {
        errorMessage = 'Special characters are not allowed in Confirm Password.';
    } else if (confirmPassword && password !== confirmPassword) {
        errorMessage = 'Passwords do not match.';
    }

    if (errorMessage) {
        errorMessageElement.textContent = errorMessage;
        return false;
    } else {
        errorMessageElement.textContent = '';
        event.target.submit();
    }
}


// $(document).ready(function () {
//     $("mapboxgl-ctrl-geocoder--input").addClass(".searchbar")
// });

$(document).on("change", ".mapboxgl-ctrl-geocoder--input", function () {
    $(".mapboxgl-ctrl-geocoder--input").addClass("test")
})