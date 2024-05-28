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


directDeliveryBtn.click(() => {
    clearSessionStorage()
    console.log("move location modal down")
    sessionStorage.setItem("feature", "direct")
})

droneShareBtn.click(() => {
    clearSessionStorage()
    console.log("move location modal down")
    sessionStorage.setItem("feature", "share")
})

// Step 2: When user confirms location in #delivery-location-modal, animate transition to #sizeSelectMenu
// ToDo: Adjust speed of transition
confirmLocationBtn.click(() => {
    let locationfields = isLocationEmpty();
    if (locationfields) {
        // Remove mainMenuCard 
        mainMenuCard.addClass("transition-transform translate-y-full")

        // Show sizeSelectMenu
        packageSizeOptions.toggle()

        // Hide mainMenuCard
        mainMenuCard.toggle()

        // Hide Location Modal
        locationModal.hide()
        document.querySelector("body > div[modal-backdrop]")?.remove()
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
            // paymentMethods.addClass("transform translate-x-full")
            console.log("toggling function")
            getCardsAndAppendToModal()
            paymentMethods.toggle()
        }, 150);

        packageSizeOptions.toggle()
    }
});


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




