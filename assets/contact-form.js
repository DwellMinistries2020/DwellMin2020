(() => {
  const form = document.getElementById('prayer-connection-form');
  if (!form) return;

  const email = form.querySelector('#request-email');
  const phone = form.querySelector('#request-phone');
  const preferred = form.querySelector('#preferred-contact');
  const status = document.getElementById('form-status');

  const clearContactErrors = () => {
    email.setCustomValidity('');
    phone.setCustomValidity('');
  };

  email.addEventListener('input', clearContactErrors);
  phone.addEventListener('input', clearContactErrors);
  preferred.addEventListener('change', clearContactErrors);

  form.addEventListener('submit', event => {
    event.preventDefault();
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
      status.textContent = 'Please review the required information above.';
      return;
    }

    const data = new FormData(form);
    const requestType = data.get('request_type');
    const name = data.get('name')?.trim() || 'Anonymous';
    const subject = 'Dwell Ministries Website - ' + requestType;
    const lines = [
      'Dwell Ministries website request',
      '',
      'Request type: ' + requestType,
      'Name: ' + name,
      'Email: ' + (data.get('email')?.trim() || 'Not provided'),
      'Phone: ' + (data.get('phone')?.trim() || 'Not provided'),
      'Response preference: ' + data.get('preferred_contact'),
      'Prayer-sharing preference: ' + data.get('sharing_permission'),
      '',
      'Message or prayer request:',
      data.get('message')?.trim() || ''
    ];

    status.textContent = 'Your email application should open with the request ready. Review the message, then press Send.';
    window.location.href = 'mailto:dwellministries2020@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  });
})();
