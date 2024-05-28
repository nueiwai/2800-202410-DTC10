let directDeliveryBtn = $("#directDeliveryBtn")
let roadsideAssistanceBtn = $("#roadsideAssistanceBtn")
let droneShareBtn = $("#droneShareBtn")
let locationModal = $("#deliveryLocationModal")
let confirmLocationBtn = $("#confirmBtn")
let mainMenuCard = $("#mainMenuCard")
let packageSizeOptions = $("#packageSizeOptions")
let selectSizeNextBtn = $("#selectSizeNextBtn")
let paymentMethods = $("#paymentMethods")
let paymentMethodNextBtn = $("#paymentMethodNextBtn")
let confirmationMenuContainer = $("#confirmationCard")
let cardContainer = $("#availableCards")

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
    sessionStorage.setItem("feature", "direct")
})

// Set the session storage for the selected feature - Drone Share
droneShareBtn.click(() => {
    clearSessionStorage()
    console.log("move location modal down")
    sessionStorage.setItem("feature", "share")
})

//Unhide the package size options and hide the location modal 
//when user clicks the confirmation button 
//after checking if the location fields are empty
confirmLocationBtn.click(() => {
    let locationfields = isLocationEmpty();
    if (locationfields) {
        // Remove mainMenuCard 
        mainMenuCard.addClass("transition-transform translate-y-full")

        // Hide Location Modal
        locationModal.hide()
        document.querySelector("body > div[modal-backdrop]")?.remove()

        // Hide mainMenuCard
        mainMenuCard.hide()

        // Show sizeSelectMenu
        packageSizeOptions.show()
    }
})

// Step 3: When user clicks next on #sizeSelectMenu, animate and transition to #paymentMethodContainer
selectSizeNextBtn.click(() => {
    if (!sessionStorage.getItem("pkgSize")) {
        alert("Please select a package size")
        return
    } else {
        packageSizeOptions.addClass("transition-transform -translate-x-full")

        setTimeout(() => {
            getCardsAndAppendToModal()
            paymentMethods.show()
        }, 150);

        packageSizeOptions.hide()
    }
});

/**
 * Unhide the main menu card and hide the package size options when the user clicks the cancel button
 * @returns {void}
 */
function selectPackageSizeCancelBtn() {
    mainMenuCard.show();
    mainMenuCard.removeClass("transition-transform translate-y-full");
    packageSizeOptions.hide();
}

// Hide the payment methods and show confirmation card when the user clicks the next button
paymentMethodNextBtn.click(() => {
    if (!sessionStorage.getItem("paymentMethod")) {
        alert("Please select a payment method")
        return
    } else {
        paymentMethods.addClass("transition-none")
        paymentMethods.removeClass("transition-none")
        paymentMethods.addClass("transition-transform -translate-x-full")

        setTimeout(() => {
            paymentMethods.toggle("hidden")
            confirmationMenuContainer.removeClass("hidden")
            confirmationMenuContainer.addClass("transform translate-x-full")
            confirmationMenuContainer.removeClass("transform translate-x-full")
        }, 150);

        appendAddresses();
        formatTime();
        confirmationMenuContainer.addClass("transition-transform -translate-x-0")
    }
});

/**
 * Unhide the package size options and hide the payment methods when the user clicks the cancel button
 * @returns {void}
 */
function selectPaymentCancelBtn() {
    paymentMethods.addClass("transition transform translate-x-full");
    setTimeout(() => {
        paymentMethods.hide()
        sessionStorage.removeItem("paymentMethod")
        packageSizeOptions.removeClass("transition-transform -translate-x-full")
        packageSizeOptions.show()
    }, 150);
}
