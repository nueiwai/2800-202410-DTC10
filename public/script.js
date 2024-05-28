let mainMenuDrawer = $("#main-menu-drawer")
let directDeliveryBtn = $("#directDeliveryBtn")
let roadsideAssistanceBtn = $("#roadsideAssistanceBtn")
let droneShareBtn = $("#droneShareBtn")
let locationModal = $("#deliveryLocationModal")
let confirmLocationBtn = $("#confirmBtn")
let mainMenuCard = $("#mainMenuCard")
let packageSizeOptions = $("#packageSizeOptions")
let selectSizeNextBtn = $("#selectSizeNextBtn")
let paymentMethods = $("#paymentMethods")
let cardContainer = $("#availableCards")
let paymentMethodNextBtn = $("#paymentMethodNextBtn")
let confirmationMenuContainer = $("#confirmationCard")
let availableSharedRoutes = $("#availableRoutes")
let availableBatteryCard = $("#availableBatteriesCard")

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
    console.log("move location modal down")
    locationModal.show()
    sessionStorage.setItem("feature", "direct")
})

// Set the session storage for the selected feature - Drone Share
droneShareBtn.click(() => {
    clearSessionStorage()
    console.log("move location modal down")
    locationModal.show()
    sessionStorage.setItem("feature", "share")
})

// Set the session storage for the selected feature - Roadside Assistance
roadsideAssistanceBtn.click(() => {
    clearSessionStorage()
    sessionStorage.setItem("feature", "roadside")
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
                packageSizeOptions.show()
                packageSizeOptions.addClass("transition ease-out duration-300 transform translate-x-0")
            }, 300);

        } else if (sessionStorage.getItem("feature") === "share") {
            // Show availableSharedRoutes
            setTimeout(() => {
                availableSharedRoutes.show()
                availableSharedRoutes.addClass("transition ease-out duration-300 transform translate-x-0")
            }, 300);
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
    setTimeout(() => {
        availableSharedRoutes.addClass("transition ease-in duration-300 transform translate-x-0")
        availableSharedRoutes.hide()
        packageSizeOptions.show()
        packageSizeOptions.addClass("transition ease-out duration-300 transform translate-x-0")
    }, 600);
}

// Hide the package size options and show the payment methods when the user clicks the next button
selectSizeNextBtn.click(() => {
    if (!sessionStorage.getItem("pkgSize")) {
        alert("Please select a package size")
        return
    } else {
        setTimeout(() => {
            packageSizeOptions.addClass("transition ease-in duration-300 transform translate-x-0")
            packageSizeOptions.hide();
            getCardsAndAppendToModal()
            paymentMethods.show()
            paymentMethods.addClass("transition ease-out duration-300 transform translate-x-0")
        }, 600);
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
            packageSizeOptions.addClass("transition ease-in duration-300 transform translate-x-0")
            packageSizeOptions.hide()
            availableSharedRoutes.show()
            availableSharedRoutes.addClass("transition ease-out duration-300 transform translate-x-0")
        }, 600);
    }
}

// Hide the payment methods and show confirmation card when the user clicks the next button
paymentMethodNextBtn.click(() => {
    if (!sessionStorage.getItem("paymentMethod")) {
        alert("Please select a payment method")
        return
    } else {
        setTimeout(() => {
            paymentMethods.addClass("transition ease-in duration-300 transform translate-x-0")
            paymentMethods.hide()

        }, 300);

        appendAddresses();
        formatTime();
        setTimeout(() => {
            confirmationMenuContainer.show()
            confirmationMenuContainer.addClass("transition ease-out duration-300 transform translate-x-0")
        }, 300);
    }
});

/**
 * Unhide the package size options and hide the payment methods when the user clicks the cancel button
 * @returns {void}
 */
function selectPaymentCancel() {
    setTimeout(() => {
        sessionStorage.removeItem("paymentMethod")
        paymentMethods.addClass("transition ease-in duration-300 transform translate-x-0")
        paymentMethods.hide()
        packageSizeOptions.show()
        packageSizeOptions.addClass("transition ease-out duration-300 transform translate-x-0")
    }, 600);
}

/**
 * hide bottom main menu card and show available battery info
 * @returns {void}
 */
function displayAvailableBattery() {
    mainMenuCard.hide()
    console.log("show available battery card")
    availableBatteryCard.show()
}