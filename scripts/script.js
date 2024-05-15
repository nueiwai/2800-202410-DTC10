async function toggleMenu(){
    document.getElementById("menu").classList.toggle("invisible")
    const info = await getUserInfo()
    userName.value = info.name
}

async function getUserInfo(){
    const response = await fetch("/getInfo");
    const info = await response.json();
    return info
}

// get user id, call db and update
async function updateUser(){
    const user = await getUserInfo()
    const uid = user._id
    const response = await fetch("/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({ 
            userID: uid, 
            userName: userName.value 
        }),
    })
    const result = await response.json()
    console.log(result)
}

// saveNameBtn.addEventListener("click", async (e) => {
//     const response = await fetch("/update", {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userID: req.session.userid, name: userName.value }),
//     })
//     console.log(await response.json())
// })