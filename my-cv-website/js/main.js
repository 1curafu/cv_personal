document.addEventListener('DOMContentLoaded', function() {
  // Calculate vh unit for mobile browsers
  function setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  setVh();
  window.addEventListener('resize', setVh);
  
  // Handle mobile menu toggle
  const mobileToggler = document.querySelector('.navbar-toggler');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileToggler && mobileMenu) {
    mobileToggler.addEventListener('click', function() {
      mobileMenu.classList.toggle('show');
      mobileToggler.classList.toggle('active');
    });
    
    // Close menu when clicking on nav links
    document.querySelectorAll('.mobile-nav-links .nav-link').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('show');
        mobileToggler.classList.remove('active');
      });
    });
  }
  
  // Dark mode toggle functionality - refactored
  const desktopToggle = document.getElementById('wave-toggle-checkbox');
  const mobileToggle = document.getElementById('mobile-wave-toggle-checkbox');
  
  if (desktopToggle && mobileToggle) {
    // Unified toggle change handler
    function handleToggleChange(sourceToggle, targetToggle) {
      targetToggle.checked = sourceToggle.checked;
      updateDarkMode();
    }
    
    desktopToggle.addEventListener('change', function() {
      handleToggleChange(desktopToggle, mobileToggle);
    });
    
    mobileToggle.addEventListener('change', function() {
      handleToggleChange(mobileToggle, desktopToggle);
    });
    
    function updateDarkMode() {
      if (desktopToggle.checked) {
        document.body.classList.add('darkmode');
        document.documentElement.classList.add('dark-mode-force');
        document.documentElement.classList.remove('light-mode-force');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.body.classList.remove('darkmode');
        document.documentElement.classList.remove('dark-mode-force');
        document.documentElement.classList.add('light-mode-force');
        localStorage.setItem('darkMode', 'false');
      }
    }
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === 'true') {
      desktopToggle.checked = true;
      mobileToggle.checked = true;
      updateDarkMode();
    } else if (savedDarkMode === 'false') {
      desktopToggle.checked = false;
      mobileToggle.checked = false;
      updateDarkMode();
    } else {
      // Check system preference if no saved preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        desktopToggle.checked = true;
        mobileToggle.checked = true;
        updateDarkMode();
      }
    }
  }
  
  // Scroll animations
  const scrollElements = document.querySelectorAll('.js-scroll');
  
  function elementInView(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  }
  
  function displayScrollElement(element) {
    element.classList.add('scrolled');
  }
  
  function hideScrollElement(element) {
    element.classList.remove('scrolled');
  }
  
  function handleScrollAnimation() {
    scrollElements.forEach((el) => {
      if (elementInView(el)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  }
  
  // Initialize scroll animations
  window.addEventListener('scroll', handleScrollAnimation);
  handleScrollAnimation();
  
  // Handle language selection
  const langButtons = document.querySelectorAll('[data-lang]');
  
  langButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      changeLanguage(lang);
    });
  });
  
  function changeLanguage(lang) {
    const langDropdowns = document.querySelectorAll('.dropdown-toggle');
    langDropdowns.forEach(dropdown => {
      if (dropdown.id === 'languageDropdown' || dropdown.id === 'mobileLanguageDropdown') {
        dropdown.textContent = lang.toUpperCase();
      }
    });
    
    const apiUrl = window.location.hostname === 'localhost' 
      ? `/api/translations/${lang}` 
      : `/.netlify/functions/translations/${lang}`;
    
    // Show loading state
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('loading');
    });
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(translations => {
        document.querySelectorAll('[data-key]').forEach(element => {
          const key = element.getAttribute('data-key');
          if (translations[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
              element.value = translations[key];
            } else {
              element.textContent = translations[key];
            }
          }
        });
        
        // Remove loading state
        sections.forEach(section => {
          section.classList.remove('loading');
        });
      })
      .catch(error => {
        console.error('Error loading translations:', error);
        
        // Remove loading state even on error
        sections.forEach(section => {
          section.classList.remove('loading');
        });
        
        // Fallback to English on error
        if (lang !== 'en') {
          console.log('Falling back to English');
          changeLanguage('en');
        }
      });
      
    localStorage.setItem('preferredLanguage', lang);
  }
  
  // Initialize language based on saved preference or browser setting
  const supportedLangs = ['en', 'de', 'ru', 'ua'];
  const savedLang = localStorage.getItem('preferredLanguage');
  
  let initialLang = 'en'; // Default fallback
  
  if (savedLang && supportedLangs.includes(savedLang)) {
    initialLang = savedLang;
  } else {
    const browserLang = navigator.language.split('-')[0];
    if (supportedLangs.includes(browserLang)) {
      initialLang = browserLang;
    }
  }
  
  changeLanguage(initialLang);
  
  // Try to autoplay videos and add fallback for mobile
  const videos = document.querySelectorAll('video');
  if (videos.length) {
    const attemptVideoPlay = () => {
      videos.forEach(video => {
        video.play().catch(() => {
        });
      });
    };
    
    attemptVideoPlay();
    
    document.addEventListener('touchstart', attemptVideoPlay, { once: true });
  }
  
  const skillPoints = document.querySelectorAll('.point-group');
  skillPoints.forEach(point => {
    point.addEventListener('touchstart', function(e) {
      e.preventDefault();
      skillPoints.forEach(p => p.classList.remove('active'));
      point.classList.add('active');
    });
  });
  
  const closeMenusHandler = function(e) {
    // Close dropdown menus when clicking/touching outside
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    if (dropdowns.length && !e.target.closest('.dropdown')) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
    
    // Close mobile menu when clicking/touching outside
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileToggler = document.querySelector('.navbar-toggler');
    
    if (mobileMenu && mobileMenu.classList.contains('show') && 
        !mobileMenu.contains(e.target) && 
        !mobileToggler.contains(e.target)) {
      mobileMenu.classList.remove('show');
      mobileToggler.classList.remove('active');
    }
  };
  
  // Add unified handler to both click and touch events
  document.addEventListener('click', closeMenusHandler);
  document.addEventListener('touchstart', closeMenusHandler);
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});