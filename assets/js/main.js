/* OSF Holdings Ltd: mobile menu, smooth scrolling and legal dialogs */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    toggle.querySelector('.icon-open').classList.toggle('hidden', open);
    toggle.querySelector('.icon-close').classList.toggle('hidden', !open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
      }
    });
  }

  /* ---------- Smooth scrolling for in-page links ---------- */
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute('href').slice(1);
    if (!id) return;

    var target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
      block: 'start'
    });

    if (history.pushState) history.pushState(null, '', '#' + id);

    // Move keyboard focus to the target without jumping again
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ---------- Legal dialogs (Privacy Policy, Terms of Service) ---------- */
  var lastTrigger = null;

  function openDialog(dialog) {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    var body = dialog.querySelector('.legal-body');
    if (body) body.scrollTop = 0;
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      if (lastTrigger) lastTrigger.focus();
    }
  }

  document.querySelectorAll('[data-dialog-open]').forEach(function (button) {
    button.addEventListener('click', function () {
      var dialog = document.getElementById(button.getAttribute('data-dialog-open'));
      if (!dialog) return;
      lastTrigger = button;
      openDialog(dialog);
    });
  });

  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.querySelectorAll('[data-dialog-close]').forEach(function (button) {
      button.addEventListener('click', function () {
        closeDialog(dialog);
      });
    });

    // Close when the backdrop (outside the dialog box) is clicked
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeDialog(dialog);
    });

    // Esc closes natively; return focus to the button that opened it
    dialog.addEventListener('close', function () {
      if (lastTrigger) lastTrigger.focus();
    });
  });

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
