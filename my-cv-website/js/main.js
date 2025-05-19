// Mobile menu toggle
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
  
  // Sync dark mode toggles between mobile and desktop
  const desktopToggle = document.getElementById('wave-toggle-checkbox');
  const mobileToggle = document.getElementById('mobile-wave-toggle-checkbox');
  
  if (desktopToggle && mobileToggle) {
    desktopToggle.addEventListener('change', function() {
      mobileToggle.checked = desktopToggle.checked;
      updateDarkMode();
    });
    
    mobileToggle.addEventListener('change', function() {
      desktopToggle.checked = mobileToggle.checked;
      updateDarkMode();
    });
    
    // Initialize dark/light mode based on user preference
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
    // Update dropdown button text
    document.getElementById('languageDropdown').textContent = lang.toUpperCase();
    document.getElementById('mobileLanguageDropdown').textContent = lang.toUpperCase();
    
    // Fetch translations from server (adjust the URL as needed)
    fetch(`/api/translations/${lang}`)
      .then(response => response.json())
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
      })
      .catch(error => {
        console.error('Error loading translations:', error);
      });
      
    localStorage.setItem('preferredLanguage', lang);
  }
  
  // Load saved language preference
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang) {
    changeLanguage(savedLang);
  }
});