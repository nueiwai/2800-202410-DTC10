const $menuCard = document.getElementById('main-menu-drawer');

// options with default values
const options = {
    placement: 'bottom',
    backdrop: true,
    bodyScrolling: false,
    edge: true,
    edgeOffset: '',
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

// Toggles visibility of account information in the #menu element found in postlogin.ejs
async function toggleMenu() {
    // document.getElementById("menu").classList.toggle("invisible")
    const user = await getUserInfo()
    document.getElementById("name").value = user.name
    username.value = user.username
    email.value = user.email
    if (user.address) {
        email.value = user.address
    }
    if (user.phonenumber) {
        email.value = user.phonenumber
    }
}

// Returns the logged in users information. Only works if you are logged in! wont work after saving unless logging in again!
async function getUserInfo() {
    const response = await fetch("/getInfo");
    const user = await response.json();
    return user
}

// Updates the user information
// ToDo: Handle errors when not logged in or else will crash
document.querySelectorAll("#saveBtn").forEach(async (button) => {
    button.addEventListener("click", async (e) => {
        const updatedField = e.target.previousElementSibling.id
        const updatedValue = e.target.previousElementSibling.value
        const user = await getUserInfo()
        const uid = user._id
        const response = await fetch("/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                userID: uid,
                query: {
                    [updatedField]: updatedValue
                }
            }),
        })
        await response.json()
            .catch(error => {
                console.log(error)
            })
    })
})

document.getElementById("directDeliveryBtn").addEventListener("click", (event) =>{
    // document.getElementById("mainMenuCard").classList.toggle("hidden")
    document.getElementById("delivery-location-modal").classList.toggle("hidden")
    document.getElementById("delivery-location-modal").style.top = "80px"
})

document.getElementById("locationModalConfirmBtn").addEventListener("click", (event)=> {
    menuCard.toggle()
    document.getElementById("delivery-location-modal").classList.toggle("hidden")
    // document.getElementById("mainMenuCard").classList.toggle("hidden")
    document.getElementById("selectSizeMenu").classList.toggle("hidden")
})

document.getElementById("selectSizeNextBtn").addEventListener("click", (event)=> {
    document.getElementById("selectSizeMenu").classList.toggle("hidden")
    document.getElementById("paymentMethodContainer").classList.toggle("hidden")
})







