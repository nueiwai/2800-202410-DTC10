const pkgButtons = document.querySelectorAll(".pkg-select");
pkgButtons.forEach(button => button.addEventListener("click", function (e) {
  console.log("setting package")
  if (e.currentTarget && e.currentTarget.id === "small") {
    sessionStorage.setItem("pkgSize", "small");
  } else if (e.currentTarget && e.currentTarget.id === "medium") {
    sessionStorage.setItem("pkgSize", "medium");
  } else if (e.currentTarget && e.currentTarget.id === "large") {
    sessionStorage.setItem("pkgSize", "large");
  }
}));