let directDeliveryBtn = $("#directDeliveryBtn")
let locationModal = $("#delivery-location-modal")
let locationModalCloseBtn = $("#location-modal-close-btn")
let confirmLocationBtn = $("#confirmBtn")
let mainMenuCard = $("#mainMenuCard")
let sizeSelectMenu = $("#selectSizeMenu")
let selectSizeNextBtn = $("#selectSizeNextBtn")
let paymentMethodContainer = $("#paymentMethodContainer")
let paymentMethodNextBtn = $("#paymentMethodNextBtn")
let confirmationMenuContainer = $("#confirmationMenuContainer")

directDeliveryBtn.click(() => {
    console.log("move location modal down")
    locationModal.removeClass("transform -translate-y-full")
    locationModal.addClass("transition-transform translate-y-[80px]")
})

locationModalCloseBtn.click(() => {
    locationModal.removeClass("transform translate-y-[80px]")
    locationModal.addClass("transition-transform -translate-y-full")
});


// Step 2: When user confirms location in #delivery-location-modal, animate transition to #sizeSelectMenu
// ToDo: Adjust speed of transition
confirmLocationBtn.click(() => {
    // Move location modal back up
    locationModal.addClass("transition-transform -translate-y-full")

    // Remove mainMenuCard 
    mainMenuCard.addClass("transition-transform -translate-x-full")

    // Show sizeSelectMenu
    sizeSelectMenu.toggle()

    // Hide mainMenuCard
    mainMenuCard.toggle()
})

// Step 3: When user clicks next on #sizeSelectMenu, animate and transition to #paymentMethodContainer
selectSizeNextBtn.click(() => {
    const elementHeight = paymentMethodContainer.outerHeight() + 60
    paymentMethodContainer.height(elementHeight)
    sizeSelectMenu.removeClass("transform translate-x-full transition-transform bottom-0 left-0 right-0 transform-none")
    sizeSelectMenu.addClass("transition-transform -translate-x-full")

    setTimeout(() => {
        paymentMethodContainer.removeClass("transform translate-x-full")
        paymentMethodContainer.addClass("transition-transform -translate-x-0")
    }, 150);
})


paymentMethodNextBtn.click(() => {
    paymentMethodContainer.addClass("transition-none")
    paymentMethodContainer.removeClass("transition-none")
    paymentMethodContainer.addClass("transition-transform -translate-x-full")

    setTimeout(() => {
        paymentMethodContainer.toggle("hidden")
        confirmationMenuContainer.removeClass("hidden")
        confirmationMenuContainer.addClass("transform translate-x-full")
        confirmationMenuContainer.removeClass("transform translate-x-full")
    }, 150);

    confirmationMenuContainer.addClass("transition-transform -translate-x-0")
})

  function validateForm(event) {
    event.preventDefault();

    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/g;
    const errorMessageElement = document.getElementById('error-message');

    const username = document.querySelector('input[name="username"]') ? document.querySelector('input[name="username"]').value : null;
    const name = document.querySelector('input[name="name"]') ? document.querySelector('input[name="name"]').value : null;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password') ? document.getElementById('confirm-password').value : null;

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




