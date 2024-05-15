// Toggles visibility of account information in the #menu element found in postlogin.ejs
async function toggleMenu(){
    document.getElementById("menu").classList.toggle("invisible")
    const info = await getUserInfo()
    document.getElementById("name").value = info.name
    username.value = info.username
    email.value = info.email
    if (info.address){
        email.value = info.address
    }
    if (info.phonenumbere){
        email.value = info.phonenumber
    }
}

// Returns the logged in users information. Only works if you are logged in! wont work after saving unless logging in again!
async function getUserInfo(){
    const response = await fetch("/getInfo");
    const info = await response.json();
    return info
}

// Updates user information when save button is clicked
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
        const result = await response.json()
        console.log(result)
    })

})
