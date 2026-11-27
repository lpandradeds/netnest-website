const form = document.querySelector('#payment-form');
const status = document.querySelector('#payment-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    status.textContent = 'Preencha todos os dados para continuar.';
    form.reportValidity();
    return;
  }

  status.textContent = 'Dados recebidos. A verificação de pagamento pode continuar.';
});
