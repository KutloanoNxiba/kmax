// script.js
// Handles: theme toggle, mobile nav, portfolio modal, contact form validation
(() => {
  // ---------- Helpers ----------
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const body = document.documentElement;

  // ---------- Theme handling ----------
  const themeToggle = qs('#themeToggle');
  const storedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  body.setAttribute('data-theme', storedTheme);

  function updateThemeUI(name) {
    themeToggle.setAttribute('aria-pressed', name === 'light' ? 'true' : 'false');
    themeToggle.title = name === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  }
  updateThemeUI(storedTheme);

  themeToggle.addEventListener('click', () => {
    const next = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeUI(next);
  });

  // ---------- Mobile nav toggle ----------
  const navToggle = qs('#navToggle');
  const navList = qs('#nav-list');
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if (navList.style.display === 'flex') {
      navList.style.display = '';
    } else {
      navList.style.display = 'flex';
    }
  });

  // Close nav when a link is clicked (mobile)
  qsa('#nav-list a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 980) {
      navList.style.display = '';
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }));

  // Smooth scroll for internal links
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1 && href.startsWith('#')) {
        const el = document.getElementById(href.slice(1));
        if (el) {
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth', block:'start'});
          history.replaceState(null, '', href);
        }
      }
    });
  });

  // ---------- Portfolio modal ----------
  const modal = qs('#modal');
  const modalTitle = qs('#modalTitle');
  const modalDesc = qs('#modalDesc');
  const modalTags = qs('#modalTags');
  const modalView = qs('#modalView');
  const modalMedia = qs('#modalMedia');

  function openModal(data, trigger) {
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalTags.textContent = `Tags: ${data.tags}`;
    // For demo: set a simple gradient background and highlight
    modalMedia.style.background = getComputedStyle(trigger.querySelector('.tile-media')).backgroundImage || 'linear-gradient(135deg,#7c5cff,#3db7ff)';
    modalView.href = '#';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    // trap focus
    lastFocused = document.activeElement;
    const closeButtons = qsa('[data-close]', modal);
    closeButtons[0]?.focus();
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    lastFocused?.focus();
  }

  let lastFocused = null;
  // attach to tiles
  qsa('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const data = {
        title: tile.dataset.title,
        desc: tile.dataset.desc,
        tags: tile.dataset.tags
      };
      openModal(data, tile);
    });
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tile.click();
      }
    });
  });

  // Modal dismiss
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]') || e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  });
  // ESC to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // ---------- Contact form (demo validation + fake send) ----------
  const form = qs('#contactForm');
  const formStatus = qs('#formStatus');

  function showStatus(message, success = true) {
    formStatus.textContent = message;
    formStatus.style.color = success ? 'var(--success)' : 'var(--danger)';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const message = qs('#message').value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill out all fields.', false);
      return;
    }
    // simple email pattern
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      showStatus('Please provide a valid email address.', false);
      return;
    }

    // simulate send (demo only — no network)
    showStatus('Sending message...', true);
    // fake async with setTimeout (user won't see network requests; this is client demo)
    setTimeout(() => {
      form.reset();
      showStatus('Thanks — your message has been received! (demo only)', true);
    }, 700);
  });

  // Set current year
  qs('#year').textContent = new Date().getFullYear();

  // Accessibility: focus trap for modal (basic)
  document.addEventListener('focus', function(e){
    if (modal.classList.contains('show') && !modal.contains(e.target)) {
      e.stopPropagation();
      modal.querySelector('[data-close]')?.focus();
    }
  }, true);

  // minor: keyboard shortcut to toggle theme: "T"
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 't' && !/input|textarea/i.test(document.activeElement.tagName)) {
      themeToggle.click();
    }
  });

})();
