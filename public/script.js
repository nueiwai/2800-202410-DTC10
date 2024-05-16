// Toggles visibility of account information in the #menu element found in postlogin.ejs
async function toggelAccountMenu() {
    document.getElementById("main-menu-drawer").classList.toggle("hidden")
    droneShareBtn.classList.toggle("hidden")
    directDeliveryBtn.classList.toggle("hidden")
    roadsideAssistanceBtn.classList.toggle("hidden")
    const user = await getUserInfo()
    document.getElementById("name").value = user.name
    username.value = user.username
    email.value = user.email
    if (user.address) {
        address.value = user.address
    }
    if (user.phonenumber) {
        phonenumber.value = user.phonenumber
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
