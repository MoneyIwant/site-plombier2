document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
  });

  // ===== MENU MOBILE =====
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) navMenu.classList.remove('open');
  });

  // ===== SCROLL FLUIDE =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 10;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  // ===== BACK TO TOP =====
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== FADE IN AU SCROLL =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.service-card, .gallery-item, .review-card, .why-card, .about-features li, .trust-item'
  ).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // ===== FILTRE GALERIE =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          item.classList.toggle('hidden', !match);
          if (match) {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          }
        }, 200);
        item.style.transition = 'opacity 0.3s, transform 0.3s';
      });
    });
  });

  // ===== SLIDER AVIS =====
  const track = document.getElementById('reviewsTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const cards = track.querySelectorAll('.review-card');
  let current = 0;
  let autoSlide;

  const getVisible = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  const totalSlides = () => Math.ceil(cards.length / getVisible());

  const buildDots = () => {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Avis ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const goTo = (index) => {
    current = Math.max(0, Math.min(index, totalSlides() - 1));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth * getVisible()}px)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  };

  document.getElementById('prevBtn').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.getElementById('nextBtn').addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  const resetAuto = () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      goTo(current + 1 < totalSlides() ? current + 1 : 0);
    }, 5000);
  };

  window.addEventListener('resize', () => { buildDots(); goTo(0); });
  buildDots();
  resetAuto();

  // ===== FORMULAIRE CONTACT =====
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Envoi en cours...</span>';
    btn.disabled = true;

    setTimeout(() => {
      successMsg.classList.add('visible');
      form.reset();
      btn.innerHTML = originalText;
      btn.disabled = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
  });

  // ===== COMPTEUR STATS HERO =====
  const animateCounter = (el, target, suffix = '') => {
    let start = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start) + suffix;
    }, 30);
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
          const raw = el.textContent.trim();
          if (raw.includes('500')) animateCounter(el, 500, '+');
          else if (raw.includes('15')) animateCounter(el, 15, '');
        });
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

});
