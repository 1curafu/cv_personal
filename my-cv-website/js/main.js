async function loadLocalTranslations() {
  const res = await fetch('my-cv-website/js/translations.json');
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

// Apply a given language’s dict to the page
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
});

// Dark-mode toggle
const waveToggle = document.getElementById('wave-toggle-checkbox');
const isDarkMode = localStorage.getItem('dark-mode') === 'true';
document.documentElement.classList.toggle('darkmode', isDarkMode);
waveToggle.checked = isDarkMode;

waveToggle.addEventListener('change', () => {
  const on = waveToggle.checked;
  document.documentElement.classList.toggle('darkmode', on);
  localStorage.setItem('dark-mode', on);
});

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

// Fallback scroll-animation logic and prefers-color-scheme handling
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

  const darkModeToggle = document.getElementById('wave-toggle-checkbox');
  const prefers = window.matchMedia('(prefers-color-scheme: dark)');

  if (localStorage.getItem('darkMode') === null && prefers.matches) {
    document.body.classList.add('darkmode');
    darkModeToggle.checked = true;
  }

  prefers.addEventListener('change', e => {
    if (localStorage.getItem('darkMode') === null) {
      if (e.matches) {
        document.body.classList.add('darkmode');
        darkModeToggle.checked = true;
      } else {
        document.body.classList.remove('darkmode');
        darkModeToggle.checked = false;
      }
    }
  });
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