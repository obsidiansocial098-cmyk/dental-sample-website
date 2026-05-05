// ── CONFIG ──────────────────────────────────────────────────────────────────
// After setting up your Google Apps Script, paste your Web App URL here:
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
// ────────────────────────────────────────────────────────────────────────────


// ── NAV SCROLL EFFECT ────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});


// ── HAMBURGER MENU ───────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}


// ── SCROLL ANIMATIONS ────────────────────────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

// Stagger card animations
document.querySelectorAll('.service-card, .why-card, .testi-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});


// ── DATE PICKER MIN DATE ─────────────────────────────────────────────────────
const dateEl = document.getElementById('f-date');
if (dateEl) {
  const today = new Date().toISOString().split('T')[0];
  dateEl.setAttribute('min', today);
}


// ── TOAST HELPER ─────────────────────────────────────────────────────────────
function showToast(title, message, success = true) {
  const toast = document.getElementById('toast');
  const toastIcon = toast.querySelector('.toast-icon');
  const toastTitle = toast.querySelector('h4');
  const toastMsg = toast.querySelector('p');

  toastIcon.textContent = success ? '✅' : '❌';
  toastIcon.style.background = success ? '#e8f7ee' : '#fee2e2';
  toastTitle.textContent = title;
  toastMsg.textContent = message;

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}


// ── FORM SUBMIT → GOOGLE SHEETS ──────────────────────────────────────────────
async function submitForm() {
  const name    = document.getElementById('f-name').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const date    = document.getElementById('f-date').value;
  const service = document.getElementById('f-service').value;
  const message = document.getElementById('f-msg').value.trim();

  // Basic validation
  if (!name || !phone || !date) {
    showToast('Missing Details', 'Please fill in your name, phone number, and preferred date.', false);
    return;
  }

  const submitBtn = document.querySelector('.form-submit');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const payload = { name, phone, email, date, service, message };

  try {
    if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      // No URL set — simulate success for testing
      await new Promise(resolve => setTimeout(resolve, 800));
      showToast('Appointment Requested!', "We'll confirm your slot within 24 hours.");
    } else {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast('Appointment Requested!', "We'll confirm your slot within 24 hours.");
    }

    // Clear form on success
    ['f-name', 'f-phone', 'f-email', 'f-date', 'f-service', 'f-msg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

  } catch (error) {
    showToast('Something went wrong', 'Please call us directly at +91 98765 43210.', false);
    console.error('Form submission error:', error);
  } finally {
    submitBtn.textContent = 'Confirm Appointment →';
    submitBtn.disabled = false;
  }
}
