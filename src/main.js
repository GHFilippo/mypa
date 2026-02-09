import './style.css'
import { productData } from './productData.js';

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

  // Populate content
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-desc').textContent = data.description;
  document.getElementById('modal-range').textContent = data.range;
  document.getElementById('modal-img').src = data.image;
  document.getElementById('modal-img').alt = data.title;
  document.getElementById('modal-pdf').href = data.pdf;
  document.getElementById('modal-request').href = `contatti.html?ref=${seriesId}`;

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

