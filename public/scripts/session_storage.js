const pkgButtons = document.querySelectorAll(".pkg-select");
pkgButtons.forEach(button => button.addEventListener("click", function (e) {
  console.log("setting package")
  if (e.target && e.target.id === "small") {
    sessionStorage.setItem("pkgSize", "small");
  } else if (e.target && e.target.id === "medium") {
    sessionStorage.setItem("pkgSize", "medium");
  } else if (e.target && e.target.id === "large") {
    sessionStorage.setItem("pkgSize", "large");
  }
}));

const paymentButtons = document.querySelectorAll(".payment-select");
paymentButtons.forEach(button => button.addEventListener("click", function (e) {
  console.log("setting payment")
  if (e.target && e.target.id === "credit") {
    sessionStorage.setItem("payment", "credit");
  } else if (e.target && e.target.id === "debit") {
    sessionStorage.setItem("payment", "debit");
  } else if (e.target && e.target.id === "crypto") {
    sessionStorage.setItem("payment", "crypto");
  }
}));

