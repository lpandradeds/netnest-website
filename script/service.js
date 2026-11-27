const purchaseButton = document.querySelector('[data-purchase]');

purchaseButton?.addEventListener('click', () => {
  window.location.href = 'payment.html';
});
