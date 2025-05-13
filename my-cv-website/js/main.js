async function loadLocalTranslations() {
  const res = await fetch('js/translations.json');
  if (!res.ok) throw new Error('Failed to load local translations');
  return await res.json();
}

async function fetchRemoteTranslations(lang) {
  try {
    const res = await fetch(`/api/translations/${lang}`);
    if (!res.ok) throw new Error('no remote');
    return await res.json();
  } catch (e) {
    console.warn('Falling back to local translations:', e);
    const all = await loadLocalTranslations();
    return all[lang] || all['en'];
  }
}

const elementsToTranslate = document.querySelectorAll('[data-key]');
const titleElement = document.getElementById('title-text');

async function applyTranslations(lang) {
  const dict = await fetchRemoteTranslations(lang);

  titleElement.textContent = dict.titleText || '';

  elementsToTranslate.forEach(el => {
    const key = el.dataset.key;
    el.textContent = dict[key] || dict.homeIntro || '';
  });
}

// On page load: set language, populate text, wire up the dropdown
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = sessionStorage.getItem('language') || 'en';
  applyTranslations(savedLang);
  document.getElementById('languageDropdown').textContent = savedLang.toUpperCase();

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', async e => {
      e.preventDefault();
      const lang = item.dataset.lang;
      sessionStorage.setItem('language', lang);
      document.getElementById('languageDropdown').textContent = lang.toUpperCase();
      await applyTranslations(lang);
    });
  });
  
  initializeDarkMode();
});

// Unified dark mode handling
function initializeDarkMode() {
  const waveToggle = document.getElementById('wave-toggle-checkbox');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Function to apply dark mode settings
  function applyDarkMode(darkMode) {
    waveToggle.checked = darkMode;
    
    document.documentElement.classList.toggle('darkmode', darkMode);
    
    if (darkMode) {
      document.documentElement.classList.add('dark-mode-force');
      document.documentElement.classList.remove('light-mode-force');
    } else {
      document.documentElement.classList.add('light-mode-force');
      document.documentElement.classList.remove('dark-mode-force');
    }
  }
  
  // Apply system preference (auto-detection)
  function followSystemPreference() {
    const systemDarkMode = prefersDarkMode.matches;
    applyDarkMode(systemDarkMode);
    localStorage.removeItem('dark-mode');
  }
  
  followSystemPreference();
  
  // Handle toggle click - allow temporary override
  waveToggle.addEventListener('change', () => {
    const darkModeOn = waveToggle.checked;
    applyDarkMode(darkModeOn);
    sessionStorage.setItem('temp-dark-mode', darkModeOn);
  });
  
  // Always stay in sync with system changes
  prefersDarkMode.addEventListener('change', (e) => {
    if (!sessionStorage.getItem('temp-dark-mode')) {
      applyDarkMode(e.matches);
    }
  });
  
  // Double-click to reset to system preference
  waveToggle.addEventListener('dblclick', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('temp-dark-mode');
    followSystemPreference();
  });
}

// Intersection-observer scroll animations
const scrollEls = document.querySelectorAll('.js-scroll');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('scrolled');
        observer.unobserve(en.target);
      }
    });
  },
  { threshold: 0.2 }
);
scrollEls.forEach(el => observer.observe(el));

// CSS variable for mobile viewport units
function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVH();
window.addEventListener('resize', setVH);

// Smooth scroll to top
document.addEventListener('DOMContentLoaded', function() {
  const scrollElements = document.querySelectorAll('.js-scroll');

  const elementInView = (el, pct = 100) => {
    const top = el.getBoundingClientRect().top;
    const height = el.getBoundingClientRect().height;
    return top <= ((window.innerHeight || document.documentElement.clientHeight) * (pct/100));
  };

  const handleScroll = () => {
    scrollElements.forEach(el => {
      if (elementInView(el, 90)) el.classList.add('scrolled');
      else el.classList.remove('scrolled');
    });
  };

  handleScroll();
  let throttleTimer;
  const throttle = (cb, time) => {
    if (throttleTimer) return;
    throttleTimer = true;
    setTimeout(() => { cb(); throttleTimer = false; }, time);
  };
  window.addEventListener('scroll', () => throttle(handleScroll, 250));
});

// Touch-device detection
document.documentElement.classList.add(
  ('ontouchstart' in window) ? 'touch-device' : 'no-touch'
);

window.addEventListener('offline', () => {
  console.warn('Offline – using local translations.');
});
window.addEventListener('online', () => {
  console.info('Back online – will fetch translations from your API.');
});