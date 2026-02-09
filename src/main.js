import { productData } from './productData.js';
import { translations } from './translations.js';

// --- Multilingual System ---
let currentLang = localStorage.getItem('mypa_lang') || 'it';


// Function to update product grid cards
function updateProductGrid() {
  document.querySelectorAll('.card[data-series]').forEach(card => {
    const seriesId = card.getAttribute('data-series');
    if (productData[seriesId]) {
      const data = productData[seriesId];
      // Description
      const descEl = card.querySelector('p');
      if (descEl) {
        if (typeof data.description === 'object') {
          descEl.innerHTML = data.description[currentLang] || data.description['it'];
        } else {
          descEl.innerHTML = data.description;
        }
      }

      // Meta Value (Range)
      const metaValEl = card.querySelector('.prod-card-meta strong');
      if (metaValEl) {
        if (typeof data.range === 'object') {
          metaValEl.innerHTML = data.range[currentLang] || data.range['it'];
        } else {
          metaValEl.innerHTML = data.range;
        }
      }
    }
  });
}

function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      // Use innerHTML to allow HTML tags in translations (e.g. <strong>, <br>)
      el.innerHTML = translations[currentLang][key];
    }
  });

  // Update product grid dynamic content
  updateProductGrid();

  // Update HTML lang attribute
  document.documentElement.setAttribute('lang', currentLang);

  // Set text direction for RTL languages
  if (currentLang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }

  // Highlight active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

window.setLanguage = function (lang) {
  currentLang = lang;
  localStorage.setItem('mypa_lang', lang);
  applyTranslations();

  // No need to explicitly handle modals here as they are populated on click
};

// Initialize translations on load
document.addEventListener('DOMContentLoaded', applyTranslations);

// Navigation Scroll Effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Simple mobile menu styles injection if active
    if (navLinks.classList.contains('active')) {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = 'var(--nav-height)';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'white';
      navLinks.style.padding = '2rem';
      navLinks.style.boxShadow = 'var(--shadow-lg)';
      navLinks.style.gap = '1.5rem';
    } else {
      navLinks.style.display = '';
    }
  });
}

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-in').forEach(el => {
  observer.observe(el);
});

// --- PRODUCT MODAL LOGIC ---
const modal = document.getElementById('product-modal');
const modalClose = document.querySelector('.modal-close');

const openModal = (seriesId) => {
  const data = productData[seriesId];
  if (!data || !modal) return;

  const getTranslated = (field) => {
    if (typeof field === 'object' && field !== null) {
      return field[currentLang] || field['it'] || '';
    }
    return field || '';
  };

  // Populate content
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-desc').textContent = getTranslated(data.description);
  document.getElementById('modal-range').textContent = getTranslated(data.range);
  document.getElementById('modal-img').src = data.image;
  document.getElementById('modal-img').alt = data.title;
  document.getElementById('modal-pdf').href = data.pdf;
  document.getElementById('modal-request').href = `contatti.html?ref=${seriesId}`;

  // Features list populate
  const featuresList = document.getElementById('modal-features');
  if (featuresList) {
    featuresList.innerHTML = '';
    const features = getTranslated(data.features);
    if (Array.isArray(features)) {
      features.forEach(feat => {
        const li = document.createElement('li');
        li.textContent = feat;
        featuresList.appendChild(li);
      });
    }
  }

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock scroll
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Unlock scroll
};

// Event listeners for cards
document.querySelectorAll('.card[data-series]').forEach(card => {
  card.addEventListener('click', (e) => {
    // Don't trigger if clicking buttons inside the card
    if (e.target.closest('.card-actions')) return;

    const seriesId = card.getAttribute('data-series');
    openModal(seriesId);
  });
});

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// Close on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

console.log('Mypa Website Initialized with Product Modals');

