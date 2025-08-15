/* Main interactive behaviors */

document.addEventListener('DOMContentLoaded', () => {
  // Dynamic year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if (nav) {
      nav.dataset.open = String(!expanded);
    }
    document.body.classList.toggle('nav-open', !expanded);
  });

  // Close nav on link click (mobile)
  if (nav) {
    nav.addEventListener('click', e => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'A' && document.body.classList.contains('nav-open')) {
        navToggle?.setAttribute('aria-expanded', 'false');
        delete nav.dataset.open;
        document.body.classList.remove('nav-open');
      }
    });
  }

  // Gallery lightbox
  const gallery = document.querySelector('[data-gallery]');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-img]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');

  if (gallery && lightbox && lightboxImg && lightboxClose) {
    gallery.addEventListener('click', e => {
      const btn = (e.target instanceof HTMLElement) ? e.target.closest('button.gallery-item') : null;
      if (!btn) return;
      const full = btn.getAttribute('data-full');
      if (!full) return;
      lightboxImg.src = full;
      lightboxImg.alt = btn.querySelector('img')?.alt || 'Gallery image';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    });

    const closeLightbox = () => {
      lightbox.hidden = true;
      lightboxImg.src = '';
      document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  // Generic form handling (demo only)
  function attachFormHandler(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const status = form.querySelector('.form-status');

    form.addEventListener('submit', e => {
      e.preventDefault();
      // Basic validation demonstration
      const fields = form.querySelectorAll('input[required], textarea[required], input[type=email]');
      let valid = true;
      fields.forEach(field => {
        if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
        const errorSpan = form.querySelector(`[data-error-for="${field.id}"]`);
        field.setAttribute('aria-invalid', 'false');
        if (!field.value.trim() || (field.type === 'email' && !/.+@.+\\..+/.test(field.value))) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
          if (errorSpan) errorSpan.textContent = field.type === 'email' ? 'Enter a valid email.' : 'This field is required.';
        } else if (errorSpan) {
          errorSpan.textContent = '';
        }
      });
      if (!valid) return;

      if (status) {
        status.hidden = false;
        status.textContent = 'Submitting...';
      }

      // Simulate network call
      setTimeout(() => {
        if (status) {
          status.textContent = 'Thank you! Your enquiry has been received (demo).';
        }
        form.reset();
      }, 1100);
    });
  }

  attachFormHandler('quick-enquiry');
  attachFormHandler('contact-form');
});
