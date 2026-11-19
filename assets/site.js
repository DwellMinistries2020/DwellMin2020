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

(() => {
  const measurementId = 'G-4HCWGHCJLZ';
  const consentKey = 'dwell-analytics-consent-v1';
  let analyticsLoaded = false;
  let lastFocusedElement = null;

  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .privacy-choices-button{position:fixed;left:16px;bottom:16px;z-index:70;min-height:44px;padding:10px 15px;border:2px solid #c7a95c;border-radius:999px;background:#050505;color:#fff;font:700 .9rem Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.28);cursor:pointer}
      .privacy-choices-button:hover{background:#24251c}.privacy-choices-button:focus-visible,.analytics-consent button:focus-visible,.analytics-consent a:focus-visible{outline:4px solid #c7a95c;outline-offset:3px}
      .analytics-consent{position:fixed;z-index:100;left:16px;right:16px;bottom:16px;margin:auto;width:min(720px,calc(100% - 32px));padding:24px;border:2px solid #c7a95c;border-radius:16px;background:#050505;color:#fff;box-shadow:0 18px 55px rgba(0,0,0,.42);font-family:Arial,Helvetica,sans-serif;line-height:1.55}
      .analytics-consent[hidden]{display:none}.analytics-consent h2{margin:0 0 8px;color:#fff;font:600 1.65rem/1.2 Georgia,serif}.analytics-consent p{margin:0;color:#eee7dc}.analytics-consent a{color:#dfe5a5}.analytics-consent-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px}.analytics-consent button{min-height:48px;padding:11px 18px;border:2px solid transparent;border-radius:9px;font:900 1rem Arial,sans-serif;cursor:pointer}.analytics-accept{background:#9da266;color:#080906}.analytics-decline{border-color:#fff!important;background:transparent;color:#fff}
      @media(max-width:620px){.privacy-choices-button{bottom:88px;left:12px}.analytics-consent{left:12px;right:12px;bottom:88px;width:calc(100% - 24px);padding:20px 18px}.analytics-consent-actions button{width:100%}}
    `;
    document.head.appendChild(style);
  };

  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  };

  const track = (eventName, parameters = {}) => {
    if (analyticsLoaded && typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters);
    }
  };

  const settingsButton = document.createElement('button');
  settingsButton.type = 'button';
  settingsButton.className = 'privacy-choices-button';
  settingsButton.textContent = 'Privacy choices';
  settingsButton.setAttribute('aria-haspopup', 'dialog');
  settingsButton.setAttribute('aria-controls', 'analytics-consent-dialog');

  const consentPanel = document.createElement('section');
  consentPanel.id = 'analytics-consent-dialog';
  consentPanel.className = 'analytics-consent';
  consentPanel.setAttribute('role', 'dialog');
  consentPanel.setAttribute('aria-modal', 'true');
  consentPanel.setAttribute('aria-labelledby', 'analytics-consent-title');
  consentPanel.setAttribute('aria-describedby', 'analytics-consent-description');
  consentPanel.innerHTML = `
    <h2 id="analytics-consent-title">Help us improve this ministry website</h2>
    <p id="analytics-consent-description">With your permission, Dwell Ministries uses Google Analytics to understand which pages and links are most helpful. We do not send prayer requests, form entries, or advertising data to Analytics. <a href="/privacy.html">Read our Privacy Policy</a>.</p>
    <div class="analytics-consent-actions">
      <button type="button" class="analytics-accept">Accept analytics</button>
      <button type="button" class="analytics-decline">Only necessary</button>
    </div>
  `;

  const getFocusableElements = () => [...consentPanel.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter(element => !element.hidden && element.getAttribute('aria-hidden') !== 'true');

  const openPanel = () => {
    lastFocusedElement = document.activeElement;
    consentPanel.hidden = false;
    settingsButton.hidden = true;
    consentPanel.querySelector('.analytics-accept').focus();
  };

  const closePanel = () => {
    consentPanel.hidden = true;
    settingsButton.hidden = false;
    const focusTarget = lastFocusedElement && document.contains(lastFocusedElement)
      ? lastFocusedElement
      : settingsButton;
    focusTarget.focus();
  };

  addStyles();
  document.body.append(settingsButton, consentPanel);

  settingsButton.addEventListener('click', openPanel);
  consentPanel.querySelector('.analytics-accept').addEventListener('click', () => {
    localStorage.setItem(consentKey, 'accepted');
    loadAnalytics();
    closePanel();
  });
  consentPanel.querySelector('.analytics-decline').addEventListener('click', () => {
    localStorage.setItem(consentKey, 'necessary');
    closePanel();
  });
  consentPanel.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closePanel();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = getFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const consent = localStorage.getItem(consentKey);
  if (consent === 'accepted') {
    loadAnalytics();
    consentPanel.hidden = true;
  } else if (consent === 'necessary') {
    consentPanel.hidden = true;
  } else {
    settingsButton.hidden = true;
    consentPanel.hidden = false;
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.href || '';
    if (href.includes('zoom.us/')) track('join_live_click');
    else if (href.includes('give.tithe.ly')) track('giving_click', { giving_method: 'tithely' });
    else if (href.includes('cash.app/')) track('giving_click', { giving_method: 'cash_app' });
    else if (href.includes('app.marriott.com/')) track('conference_hotel_click');
    else if (href.includes('instagram.com/dwell_ministries2020')) track('instagram_click');
  });

  const ministryForm = document.getElementById('ministry-form');
  if (ministryForm) {
    ministryForm.addEventListener('submit', () => track('ministry_form_prepare'));
  }
})();
