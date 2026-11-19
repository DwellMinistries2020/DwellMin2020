(() => {
  const form = document.getElementById('prayer-connection-form');
  if (!form) return;
  const requestType = form.querySelector('#request-type');
  const email = form.querySelector('#request-email');
  const phone = form.querySelector('#request-phone');
  const preferred = form.querySelector('#preferred-contact');
  const message = form.querySelector('#request-message');
  const messageField = message.closest('.form-field');
  const guestFields = form.querySelector('#guest-feedback-fields');
  const status = document.getElementById('form-status');
  const started = form.querySelector('#form-started');
  const submitButton = form.querySelector('button[type="submit"]');
  const firstTimeLabel = 'First-Time Guest Feedback';
  if (started) started.value = String(Date.now());
  const isFirstTimeGuest = () => requestType.value === firstTimeLabel;
  const updateFormMode = () => {
    const guestMode = isFirstTimeGuest();
    guestFields.hidden = !guestMode;
    messageField.hidden = guestMode;
    message.required = !guestMode;
    if (!guestMode && message.dataset.generatedGuestFeedback === 'true') { message.value = ''; delete message.dataset.generatedGuestFeedback; }
  };
  const clearContactErrors = () => { email.setCustomValidity(''); phone.setCustomValidity(''); };
  const params = new URLSearchParams(window.location.search);
  if (params.get('request') === 'first-time') requestType.value = firstTimeLabel;
  email.addEventListener('input', clearContactErrors);
  phone.addEventListener('input', clearContactErrors);
  preferred.addEventListener('change', clearContactErrors);
  requestType.addEventListener('change', updateFormMode);
  updateFormMode();
  form.addEventListener('submit', event => {
    clearContactErrors();
    if (isFirstTimeGuest()) {
      const value = id => (form.querySelector(id)?.value || '').trim();
      message.value = ['FIRST-TIME GUEST FEEDBACK','Experience: ' + (value('#experience-rating') || 'Not provided'),'Requested next step: ' + (value('#guest-next-step') || 'No follow-up requested'),'What they enjoyed: ' + (value('#experience-highlight') || 'Not provided'),'What was unclear or difficult: ' + (value('#experience-confusion') || 'Not provided'),'Additional comments: ' + (value('#guest-comments') || 'Not provided')].join('\n');
      message.dataset.generatedGuestFeedback = 'true';
    }
    if (preferred.value === 'Reply by email' && !email.value.trim()) email.setCustomValidity('Please enter an email address for an email response.');
    if ((preferred.value === 'Reply by phone' || preferred.value === 'Reply by WhatsApp') && !phone.value.trim()) phone.setCustomValidity('Please enter a phone number for this response method.');
    if (preferred.value === 'Reply by email or phone' && !email.value.trim() && !phone.value.trim()) email.setCustomValidity('Please enter an email address or phone number for a response.');
    if (!form.reportValidity()) { event.preventDefault(); status.textContent = 'Please review the required information above.'; return; }
    status.textContent = 'Sending your request securely…';
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Sending…'; }
  });
})();