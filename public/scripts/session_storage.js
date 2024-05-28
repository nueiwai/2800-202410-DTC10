const pkgButtons = document.querySelectorAll(".pkg-select");

// setting session storage for chosen package size
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

/**
 * Format the estimated time and display it in the confirmation modal
 * @returns {void}
 */
function formatTime() {
  const estimatedTime = sessionStorage.getItem("estimatedDuration");
  let totalSeconds = parseInt(estimatedTime, 10); // Parse time string to number

  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "Invalid input"; // Handle invalid or negative values
  }

  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let remainingSeconds = totalSeconds % 60;

  // Format the output string
  let formattedTime = "";
  if (hours > 0) {
    formattedTime += `${hours} hour${hours > 1 ? "s" : ""} `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes} minute${minutes > 1 ? "s" : ""} `;
  }
  formattedTime += `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;

  let timeContainer = document.getElementById("estimatedTime");
  timeContainer.textContent = formattedTime.trim();// Remove any trailing spaces
}