/**
 * Get cards from the database and append them to the modal
 * @returns {void}
 */
function getCardsAndAppendToModal() {
  let cards = window.cardData;
  cardContainerHTML = ""
  cards.forEach(card => {
    let id = card._id;
    let type = card.cardType;
    let number = card.cardNumber;
    let cardHTML = `
    <button id="${id}" class="payment-select flex container items-center p-4 rounded-lg bg-buttonBg gap-6 focus:ring-2 ring-white">
      <div class="p-2  rounded-full w-[48px] h-[48px] max-w-[48px] max-h-[48px]">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-credit-card" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
          <path d="M3 10l18 0" />
          <path d="M7 15l.01 0" />
          <path d="M11 15l2 0" />
        </svg>
      </div>
      <div class="flex flex-col font-medium text-gray-200">
        <p class="text-center">${type}</p>
        <p class="text-center"> **** **** **** <span>${number.slice(-4)}</p>
      </div>
    </button>`
    cardContainerHTML += cardHTML;
  });

  cardContainer.html(cardContainerHTML)
  const paymentButtons = document.querySelectorAll(".payment-select");
  paymentButtons.forEach(button => button.addEventListener("click", function (e) {
    console.log("setting payment")
    if (e.currentTarget && e.currentTarget.id) {
      sessionStorage.setItem("paymentMethod", e.currentTarget.id);
    }
  }));
}