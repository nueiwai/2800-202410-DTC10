// console.log(window.location)

const $menuCard = document.getElementById('main-menu-drawer');

// options with default values
const options = {
    placement: 'bottom',
    backdrop: false,
    bodyScrolling: false,
    edge: true,
    edgeOffset: 'bottom-[60px]',
    backdropClasses:
        'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30',
    onHide: () => {
        console.log('drawer is hidden');
    },
    onShow: () => {
        console.log('drawer is shown');
    },
    onToggle: () => {
        console.log('drawer has been toggled');
    }
};

// instance options object
const instanceOptions = {
    id: 'main-menu-drawer',
    override: true
};

const menuCard = new Drawer($menuCard, options, instanceOptions);
menuCard.hide()

// // Toggles visibility of account information in the #menu element found in postlogin.ejs
// async function toggleMenu() {
//     // document.getElementById("menu").classList.toggle("invisible")
//     const user = await getUserInfo()
//     document.getElementById("name").value = user.name
//     username.value = user.username
//     email.value = user.email
//     if (user.address) {
//         email.value = user.address
//     }
//     if (user.phonenumber) {
//         email.value = user.phonenumber
//     }
// }

// Returns the logged in users information. Only works if you are logged in! wont work after saving unless logging in again!
async function getUserInfo() {
    const response = await fetch("/getInfo");
    const user = await response.json();
    return user
}

// // Updates the user information
// document.querySelectorAll("#saveBtn").forEach(async (button) => {
//     button.addEventListener("click", async (e) => {
//         const updatedField = e.target.previousElementSibling.id
//         const updatedValue = e.target.previousElementSibling.value
//         const user = await getUserInfo()
//         const uid = user._id
//         const response = await fetch("/update", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json; charset=UTF-8"
//             },
//             body: JSON.stringify({
//                 userID: uid,
//                 query: {
//                     [updatedField]: updatedValue
//                 }
//             }),
//         })
//         await response.json()
//             .catch(error => {
//                 console.log(error)
//             })
//     })
// })


// When direct delivery button is clicked, show delivery location modal
document.getElementById("directDeliveryBtn").addEventListener("click", (event) => {
    // document.getElementById("mainMenuCard").classList.toggle("hidden")
    // document.getElementById("selectSizeMenu").classList.toggle("hidden")
    document.getElementById("delivery-location-modal").classList.toggle("hidden")
    document.getElementById("delivery-location-modal").style.top = "80px"
})

// When delivery location is confirmed, hide delivery-location-modal, main-menu-card, and show sizeSelectionMenu container
document.getElementById("locationModalConfirmBtn").addEventListener("click", (event) => {
    // menuCard.toggle()
    document.getElementById("delivery-location-modal").classList.toggle("hidden")
    document.getElementById("mainMenuCard").classList.toggle("hidden")
    document.getElementById("selectSizeMenu").classList.toggle("absolute")
    // -translate-x-[391px]
    // -translate-x-[391]
    document.getElementById("paymentMethodContainer").classList.toggle("hidden")
    const elementWidth = paymentMethodContainer.offsetWidth
    // const tailwindClassString = `-translate-x-[${elementWidth}px]`
    // paymentMethodContainer.classList.add(`${tailwindClassString}`)
    confirmationMenuContainer.classList.add(`-translate-x-[${elementWidth}px]`)
    document.getElementById("paymentMethodContainer").classList.toggle("hidden")
})

// When next button is clicked in selectSizeMenu, hide sizeSelectMenu and show paymentMethodContainer
document.getElementById("selectSizeNextBtn").addEventListener("click", (event) => {
    // transform translate-x-0
    document.getElementById("selectSizeMenu").classList.toggle("hidden")
    document.getElementById("paymentMethodContainer").classList.toggle("hidden")
    const paymentMethodContainerWidth = paymentMethodContainer.offsetWidth
    paymentMethodContainer.style.transform = `translate(-${paymentMethodContainerWidth})`
    // paymentMethodContainer.classList.add(`-translate-x-[${paymentMethodContainerWidth}px]`)
    // paymentMethodContainer.classList.remove(`-translate-x-[${paymentMethodContainerWidth}px]`)
    // paymentMethodContainer.classList.add(`transition-transform`)
    // paymentMethodContainer.classList.add(`-translate-x-0`)
    console.log("move")
    // document.getElementById("paymentMethodContainer").classList.add("ease-in")
    // document.getElementById("paymentMethodContainer").classList.add("translate-x-0")
})

// When payment method is confirmed, show confirmation page
document.getElementById("paymentMethodNextBtn").addEventListener("click", (event) => {
    document.getElementById("paymentMethodContainer").classList.toggle("hidden")
    document.getElementById("confirmationMenuContainer").classList.toggle("hidden")
})






