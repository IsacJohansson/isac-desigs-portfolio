import '../styles/main.css';
import { I18nManager } from './i18n.js';
import { TechnoVisualizer } from './canvas-visualizer.js';
import { CursorController } from './cursor.js';
import { ThumbnailScrollController } from './thumbnail-scroll.js';

document.addEventListener('DOMContentLoaded', () => {
  // 0. Organic Growing Tree & Preloader Particle Animation
  const preloader = document.getElementById('page-preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const pCanvas = document.getElementById('preloader-canvas');

  if (preloader) {
    if (preloaderBar) preloaderBar.style.width = '70%';

    // Particle Canvas Animation
    if (pCanvas) {
      const ctx = pCanvas.getContext('2d');
      let width = pCanvas.width = window.innerWidth;
      let height = pCanvas.height = window.innerHeight;

      const particles = [];
      const particleCount = 40;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: height + Math.random() * 100,
          radius: Math.random() * 2.2 + 0.8,
          speedY: Math.random() * 1.2 + 0.6,
          speedX: (Math.random() - 0.5) * 0.6,
          alpha: Math.random() * 0.6 + 0.2
        });
      }

      const renderParticles = () => {
        if (!document.body.contains(preloader)) return;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#0f172a';

        particles.forEach(p => {
          p.y -= p.speedY;
          p.x += Math.sin(p.y * 0.02) * 0.5;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.globalAlpha = p.alpha;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        requestAnimationFrame(renderParticles);
      };
      renderParticles();
    }

    const startHideTime = Date.now();
    const minDisplayTime = 800; // Fast & crisp preloader transition

    const hidePreloader = () => {
      if (preloaderBar) preloaderBar.style.width = '100%';
      const elapsed = Date.now() - startHideTime;
      const delay = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        preloader.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 800);
      }, delay);
    };

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
      setTimeout(hidePreloader, 2200);
    }
  }

  // 1. Initialize i18n
  const i18n = new I18nManager();
  i18n.init();

  // 2. Initialize Ambient Light Grid
  const visualizer = new TechnoVisualizer('techno-canvas');

  // 3. Initialize Cursor
  const cursor = new CursorController();

  // 4. Initialize Thumbnail Mouse & Page Scroll Sync
  const thumbScroll = new ThumbnailScrollController();
  thumbScroll.init();

  // 4. Live Clock Tracker (Sweden CET)
  const updateClock = () => {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    const now = new Date();
    const options = { timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    clockEl.textContent = `${now.toLocaleTimeString('sv-SE', options)} CET`;
  };
  updateClock();
  setInterval(updateClock, 1000);

  // 5. Project Filter Logic
  const filterBtns = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
      });
      btn.classList.add('bg-slate-900', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // 6. Project Quick View Modal
  const modal = document.getElementById('project-modal');
  const modalCard = document.getElementById('modal-card');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalLink = document.getElementById('modal-link');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');

  const openModal = () => {
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    if (modalCard) {
      modalCard.classList.remove('scale-95');
      modalCard.classList.add('scale-100');
    }
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    if (modalCard) {
      modalCard.classList.add('scale-95');
      modalCard.classList.remove('scale-100');
    }
  };

  document.querySelectorAll('[data-quick-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      if (!card) return;

      const name = card.getAttribute('data-name');
      const cat = card.getAttribute('data-cat');
      const desc = card.getAttribute('data-desc');
      const url = card.getAttribute('data-url');
      const img = card.getAttribute('data-img');

      if (modalTitle) modalTitle.textContent = name;
      if (modalCategory) modalCategory.textContent = cat;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalLink) modalLink.href = url;
      if (modalImg && img) modalImg.src = img;

      openModal();
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

  // 7. Copy Email to Clipboard
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notification');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = "isac.johanssonmusic@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        if (toast) {
          toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
          toast.classList.add('opacity-100', 'translate-y-0');

          setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
            toast.classList.remove('opacity-100', 'translate-y-0');
          }, 3000);
        }
      });
    });
  }

  // 8. Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = `<span data-i18n="contactSendingBtn">SKICKAR...</span>`;
        submitBtn.disabled = true;
        i18n.setLanguage(i18n.currentLang);
      }

      try {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          contactForm.reset();
          if (formSuccess) {
            formSuccess.classList.remove('hidden');
            formSuccess.className = 'mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold';
            formSuccess.innerHTML = '<span data-i18n="contactSuccessMsg">Tack för ditt meddelande! Jag återkopplar så snart jag kan.</span>';
            i18n.setLanguage(i18n.currentLang);
            setTimeout(() => formSuccess.classList.add('hidden'), 5000);
          }
        } else {
          throw new Error('Failed to send');
        }
      } catch (err) {
        console.error(err);
        if (formSuccess) {
          formSuccess.classList.remove('hidden');
          formSuccess.className = 'mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold';
          formSuccess.innerHTML = '<span>Failed to send message. Please try again later.</span>';
          setTimeout(() => formSuccess.classList.add('hidden'), 5000);
        }
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = `<span data-i18n="contactSubmitBtn">SKICKA FÖRFRÅGAN</span>`;
          submitBtn.disabled = false;
          i18n.setLanguage(i18n.currentLang);
        }
      }
    });
  }

  // 9. Scroll to top button & macOS Glass Navbar scroll state
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const headerNav = document.querySelector('.glass-nav');
  if (headerNav) {
    const handleNavScroll = () => {
      if (window.scrollY > 20) {
        headerNav.classList.add('is-scrolled');
      } else {
        headerNav.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }
});
