// Мороз Денис - Main JavaScript (Справочная информация)

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all components
  initPreloader();
  initFixedNavigation();
  initMobileMenu();
  initScrollAnimations();
  initParticles();
  initSmoothScroll();
  initHeroParallax();
  initFaqAccordion();
  initCookieBanner();
});

// ===== Catalog Carousel =====
function initCatalogCarousel() {
  const carousel = document.querySelector('.large-catalog-grid');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (!carousel || !prevBtn || !nextBtn) return;

  let itemWidth = 0;
  let totalItems = 0;
  let currentIndex = 0;

  // Calculate item width
  function calculateItemWidth() {
    const items = carousel.querySelectorAll('.catalog-item');
    totalItems = items.length;
    itemWidth = items[0] ? items[0].offsetWidth + 15 : 0;
  }

  calculateItemWidth();

  // Create dots
  function createDots() {
    if (window.innerWidth > 768) {
      dotsContainer.innerHTML = '';
      return;
    }

    const dotsCount = Math.min(5, totalItems);
    dotsContainer.innerHTML = '';

    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Update dots
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    if (dots.length === 0) return;

    // Map current index to dot index (5 dots for many items)
    const dotIndex = Math.min(Math.floor(currentIndex / Math.ceil(totalItems / 5)), dots.length - 1);
    dots.forEach(function (dot, index) {
      dot.classList.toggle('active', index === dotIndex);
    });
  }

  // Go to slide
  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalItems) index = totalItems - 1;

    currentIndex = index;
    // Use scrollIntoView for better centering with scroll-snap
    const items = carousel.querySelectorAll('.catalog-item');
    if (items[index]) {
      items[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
    updateDots();
  }

  // Navigation buttons
  prevBtn.addEventListener('click', function () {
    goToSlide(currentIndex - 1);
  });

  nextBtn.addEventListener('click', function () {
    goToSlide(currentIndex + 1);
  });

  // Scroll spy
  carousel.addEventListener('scroll', function () {
    if (itemWidth === 0) return;
    const scrollPosition = carousel.scrollLeft;
    currentIndex = Math.round(scrollPosition / itemWidth);
    updateDots();
  });

  // Initialize
  createDots();

  // Handle resize
  window.addEventListener('resize', function () {
    calculateItemWidth();
    createDots();
  });
}

// ===== Categories Carousel =====
function initCategoriesCarousel() {
  const carousel = document.querySelector('.categories-grid');
  const prevBtn = document.querySelector('.categories-carousel-prev');
  const nextBtn = document.querySelector('.categories-carousel-next');
  const dotsContainer = document.querySelector('.categories-carousel-dots');

  if (!carousel || !prevBtn || !nextBtn) return;

  let itemWidth = 0;
  let totalItems = 0;
  let currentIndex = 0;

  // Calculate item width
  function calculateItemWidth() {
    const items = carousel.querySelectorAll('.category-card');
    totalItems = items.length;
    itemWidth = items[0] ? items[0].offsetWidth + 15 : 0;
  }

  calculateItemWidth();

  // Create dots
  function createDots() {
    if (window.innerWidth > 768) {
      dotsContainer.innerHTML = '';
      return;
    }

    const dotsCount = Math.min(5, totalItems);
    dotsContainer.innerHTML = '';

    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Update dots
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    if (dots.length === 0) return;

    // Map current index to dot index (5 dots for many items)
    const dotIndex = Math.min(Math.floor(currentIndex / Math.ceil(totalItems / 5)), dots.length - 1);
    dots.forEach(function (dot, index) {
      dot.classList.toggle('active', index === dotIndex);
    });
  }

  // Go to slide
  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalItems) index = totalItems - 1;

    currentIndex = index;
    // Use scrollIntoView for better centering with scroll-snap
    const items = carousel.querySelectorAll('.category-card');
    if (items[index]) {
      items[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
    updateDots();
  }

  // Navigation buttons
  prevBtn.addEventListener('click', function () {
    goToSlide(currentIndex - 1);
  });

  nextBtn.addEventListener('click', function () {
    goToSlide(currentIndex + 1);
  });

  // Scroll spy
  carousel.addEventListener('scroll', function () {
    if (itemWidth === 0) return;
    const scrollPosition = carousel.scrollLeft;
    currentIndex = Math.round(scrollPosition / itemWidth);
    updateDots();
  });

  // Initialize
  createDots();

  // Handle resize
  window.addEventListener('resize', function () {
    calculateItemWidth();
    createDots();
  });
}

// ===== Preloader =====
function initPreloader() {
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 1500);
  });
}

// ===== Fixed Navigation =====
function initFixedNavigation() {
  const fixedNav = document.getElementById('fixedNav');
  const fixedLinks = document.querySelectorAll('.fixed-link');
  const sections = document.querySelectorAll('section[id]');

  // Всегда показываем навигацию (не скрываем при загрузке)
  if (fixedNav) {
    fixedNav.style.transform = 'translateY(0)';
  }

  window.addEventListener('scroll', function () {
    const scrollY = window.pageYOffset;

    // Обновляем активную ссылку на основе позиции скролла
    sections.forEach(function (section) {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        fixedLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// ===== Mobile Menu =====
function initMobileMenu() {
  const menuToggle = document.getElementById('fixedMenuToggle');
  const mobileMenu = document.getElementById('mobileFixedMenu');
  const menuClose = document.getElementById('mobileFixedClose');
  const mobileLinks = document.querySelectorAll('.mobile-fixed-link');
  const menuOverlay = document.getElementById('mobileMenuOverlay');

  function openMenu() {
    mobileMenu.classList.add('active');
    if (menuOverlay) menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Добавляем небольшую задержку для анимации появления элементов
    setTimeout(() => {
      mobileLinks.forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.05}s`;
        link.classList.add('animate-in');
      });
    }, 100);
  }

  function closeMenu() {
    // Убираем задержки перед закрытием
    mobileLinks.forEach(link => {
      link.style.transitionDelay = '0s';
      link.classList.remove('animate-in');
    });

    mobileMenu.classList.remove('active');
    if (menuOverlay) menuOverlay.classList.remove('active');
    if (menuToggle) menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      if (this.classList.contains('active')) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    if (menuClose) {
      menuClose.addEventListener('click', closeMenu);
    }

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    // Закрытие меню по клавише Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Закрытие при клике на категории запчастей
    const categoryItems = document.querySelectorAll('.mobile-category-item');
    categoryItems.forEach(function (item) {
      item.addEventListener('click', closeMenu);
    });
  }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const targetPosition = targetElement.offsetTop - 100;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(function (element) {
    observer.observe(element);
  });

  // Scroll to top button
  if (scrollToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 500) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });

    scrollToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ===== Particles Animation =====
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const particleCount = 30;
  const colors = ['#22c55e', '#0a0a0a', '#1a1a1a'];

  for (let i = 0; i < particleCount; i++) {
    createParticle();
  }

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            opacity: ${Math.random() * 0.3 + 0.1};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;

    particlesContainer.appendChild(particle);
  }

  const style = document.createElement('style');
  style.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
}

// ===== Notification System =====
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message) {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.classList.add('notification');

  // Create elements separately to prevent XSS
  const contentDiv = document.createElement('div');
  contentDiv.className = 'notification-content';

  const icon = document.createElement('i');
  icon.className = 'fas fa-info-circle';

  const span = document.createElement('span');
  span.textContent = message; // Use textContent to prevent XSS

  contentDiv.appendChild(icon);
  contentDiv.appendChild(span);
  notification.appendChild(contentDiv);

  notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #0a0a0a;
        color: white;
        padding: 16px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;

  const content = notification.querySelector('.notification-content');
  content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
    `;

  const iconEl = notification.querySelector('i');
  iconEl.style.cssText = `
        color: #22c55e;
        font-size: 20px;
    `;

  document.body.appendChild(notification);

  setTimeout(function () {
    notification.style.transform = 'translateX(-50%) translateY(0)';
    notification.style.opacity = '1';
  }, 10);

  setTimeout(function () {
    notification.style.transform = 'translateX(-50%) translateY(100px)';
    notification.style.opacity = '0';
    setTimeout(function () {
      notification.remove();
    }, 400);
  }, 3000);
}

// ===== Lazy Loading Images =====
document.addEventListener('DOMContentLoaded', function () {
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  } else {
    lazyImages.forEach(function (img) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
});

// ===== Hero Parallax Effect =====
function initHeroParallax() {
  // Disable parallax on mobile devices for better performance
  if (window.innerWidth < 768) return;

  const heroBg = document.querySelector('.hero-bg');
  const heroBgImage = document.querySelector('.hero-bg-image');

  if (!heroBg || !heroBgImage) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.pageYOffset;
    const heroSection = document.querySelector('.hero');

    if (!heroSection) return;

    const heroTop = heroSection.offsetTop;
    const heroHeight = heroSection.offsetHeight;

    // Check if hero is in view
    if (scrollY + window.innerHeight > heroTop && scrollY < heroTop + heroHeight) {
      const parallaxAmount = (scrollY - heroTop) * 0.4;
      heroBg.style.transform = `translateY(${parallaxAmount}px)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // Initial call
  updateParallax();
}

// ===== FAQ Accordion =====
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Close all items
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// ===== Cookie Banner =====
function initCookieBanner() {
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  if (!cookieBanner) {
    return;
  }

  // Check if user has already made a choice
  const savedConsent = localStorage.getItem('cookieConsent');
  if (savedConsent) {
    return; // Don't show banner if user already made a choice
  }

  // Show banner immediately without delay
  cookieBanner.classList.add('active');

  // Accept button handler
  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('active');
    });
  }

  // Decline button handler
  if (cookieDecline) {
    cookieDecline.addEventListener('click', function () {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('active');
    });
  }
}
