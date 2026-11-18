(() => {
  const toggle = document.querySelector('.menu-toggle');
  if (!toggle) return;
  const nav = document.getElementById(toggle.getAttribute('aria-controls'));
  if (!nav) return;
  const icon = toggle.querySelector('.menu-toggle-icon');
  const label = toggle.querySelector('.menu-toggle-label');

  const setOpen = (open, returnFocus = false) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    if (icon) icon.textContent = open ? '×' : '☰';
    if (label) label.textContent = open ? 'Close' : 'Menu';
    if (!open && returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', event => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });

  const desktop = window.matchMedia('(min-width: 851px)');
  const closeOnDesktop = event => { if (event.matches) setOpen(false); };
  if (desktop.addEventListener) desktop.addEventListener('change', closeOnDesktop);
  else desktop.addListener(closeOnDesktop);
})();
