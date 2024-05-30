/**
 * Light up the component
 * This is only for demonstration purposes
 * @param {string} componentId
 * @param {number} duration
 * @param {number} delay
 * @returns {void}
 * */
function lightUpComponent(componentId, duration, delay) {
  const component = document.getElementById(componentId);
  console.log(component);
  console.log(duration);
  console.log(delay);
  // Apply animation duration and delay
  component.style.animationDuration = `${duration}s`;
  component.style.animationDelay = `${delay}s`;

  // Add the animation class
  component.classList.add("light-up");
}

function animateComponents(totalDuration, eachDuration) {
  lightUpComponent("confirmation_1", totalDuration, 1);
  lightUpComponent("confirmation_2", totalDuration, eachDuration);
  lightUpComponent("confirmation_3", totalDuration, 2 * eachDuration);
  lightUpComponent("confirmation_4", totalDuration, 3 * eachDuration);
}
