(() => {
  const form = document.getElementById('prayer-connection-form');
  if (!form) return;

  const email = form.querySelector('#request-email');
  const phone = form.querySelector('#request-phone');
  const preferred = form.querySelector('#preferred-contact');
  const status = document.getElementById('form-status');
  const started = form.querySelector('#form-started');
  const submitButton = form.querySelector('button[type="submit"]');

  if (started) started.value = String(Date.now());

  const clearContactErrors = () => {
    email.setCustomValidity('');
    phone.setCustomValidity('');
  };

  email.addEventListener('input', clearContactErrors);
  phone.addEventListener('input', clearContactErrors);
  preferred.addEventListener('change', clearContactErrors);

  form.addEventListener('submit', event => {
    clearContactErrors();

    if (preferred.value === 'Reply by email' && !email.value.trim()) {
      email.setCustomValidity('Please enter an email address for an email response.');
    }
    if (preferred.value === 'Reply by phone' && !phone.value.trim()) {
      phone.setCustomValidity('Please enter a phone number for a phone response.');
    }
    if (preferred.value === 'Reply by email or phone' && !email.value.trim() && !phone.value.trim()) {
      email.setCustomValidity('Please enter an email address or phone number for a response.');
    }

    if (!form.reportValidity()) {
      event.preventDefault();
      status.textContent = 'Please review the required information above.';
      return;
    }

    status.textContent = 'Sending your request securely…';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }
  });
})();
