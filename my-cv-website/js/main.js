// Local translations for fallback
const translations = {
  en: {
    titleText: "Your Name - CV",
    navHome: "Home",
    navAbout: "About",
    navProjects: "Projects",
    navTimeline: "Timeline",
    navSkills: "Skills",
    homeHeading: "Welcome to My CV Website",
    homeTagline: "I'm Your Name – a passionate developer and creative thinker.",
    homeIntro: "A brief introduction about you.",
    aboutHeading: "About Me",
    aboutText: "Short biography, skills, and background.",
    projectsHeading: "Projects",
    timelineHeading: "Timeline",
    skillsHeading: "Skills",
    projectFirstName: "Project One",
    projectFirstDescription: "Description of project one.",
    projectFirstBtn: "View Project",
    projectSecondName: "Project Two",
    projectSecondDescription: "Description of project two.",
    projectSecondBtn: "View Project",
    timelineFirstName: "Experience One",
    timelineFirstDescription: "Description of experience one.",
    timelineFirstDate: "Date of experience one.",
    timelineSecondName: "Experience Two",
    timelineSecondDescription: "Description of experience two.",
    timelineSecondDate: "Date of experience two."
  },
  de: {
    titleText: "Dein Name - Lebenslauf",
    navHome: "Startseite",
    navAbout: "Über mich",
    navProjects: "Projekte",
    navTimeline: "Zeitachse",
    navSkills: "Fähigkeiten",
    homeHeading: "Willkommen auf meiner CV-Website",
    homeTagline: "Ich bin Dein Name – ein leidenschaftlicher Entwickler und kreativer Denker.",
    homeIntro: "Eine kurze Einführung über dich.",
    aboutHeading: "Über mich",
    aboutText: "Kurze Biografie, Fähigkeiten und Hintergrund.",
    projectsHeading: "Projekte",
    timelineHeading: "Zeitachse",
    skillsHeading: "Fähigkeiten",
    projectFirstName: "Project One",
    projectFirstDescription: "Description of project one.",
    projectFirstBtn: "View Project",
    projectSecondName: "Project Two",
    projectSecondDescription: "Description of project two.",
    projectSecondBtn: "View Project",
    timelineFirstName: "Experience One",
    timelineFirstDescription: "Description of experience one.",
    timelineFirstDate: "Date of experience one.",
    timelineSecondName: "Experience Two",
    timelineSecondDescription: "Description of experience two.",
    timelineSecondDate: "Date of experience two."
  },
  ru: {
    titleText: "Ваше имя - Резюме",
    navHome: "Главная",
    navAbout: "Обо мне",
    navProjects: "Проекты",
    navTimeline: "Хронология",
    navSkills: "Навыки",
    homeHeading: "Добро пожаловать на мой сайт-резюме",
    homeTagline: "Я Ваше Имя – увлеченный разработчик и творческий мыслитель.",
    homeIntro: "Краткое представление о вас.",
    aboutHeading: "Обо мне",
    aboutText: "Краткая биография, навыки и опыт.",
    projectsHeading: "Проекты",
    timelineHeading: "Хронология",
    skillsHeading: "Навыки",
    projectFirstName: "Project One",
    projectFirstDescription: "Description of project one.",
    projectFirstBtn: "View Project",
    projectSecondName: "Project Two",
    projectSecondDescription: "Description of project two.",
    projectSecondBtn: "View Project",
    timelineFirstName: "Experience One",
    timelineFirstDescription: "Description of experience one.",
    timelineFirstDate: "Date of experience one.",
    timelineSecondName: "Experience Two",
    timelineSecondDescription: "Description of experience two.",
    timelineSecondDate: "Date of experience two."
  },
  ua: {
    titleText: "Ваше Ім'я - Резюме",
    navHome: "Головна",
    navAbout: "Про мене",
    navProjects: "Проєкти",
    navTimeline: "Хронологія",
    navSkills: "Навички",
    homeHeading: "Ласкаво просимо на мій сайт-резюме",
    homeTagline: "Я Ваше Ім'я – захоплений розробник і творчий мислитель.",
    homeIntro: "Коротке представлення про вас.",
    aboutHeading: "Про мене",
    aboutText: "Коротка біографія, навички та досвід.",
    projectsHeading: "Проєкти",
    timelineHeading: "Хронологія",
    skillsHeading: "Навички",
    projectFirstName: "Project One",
    projectFirstDescription: "Description of project one.",
    projectFirstBtn: "View Project",
    projectSecondName: "Project Two",
    projectSecondDescription: "Description of project two.",
    projectSecondBtn: "View Project",
    timelineFirstName: "Experience One",
    timelineFirstDescription: "Description of experience one.",
    timelineFirstDate: "Date of experience one.",
    timelineSecondName: "Experience Two",
    timelineSecondDescription: "Description of experience two.",
    timelineSecondDate: "Date of experience two."
  }
};

// Remote fetch translations
async function fetchRemoteTranslations(lang) {
  try {
    const res = await fetch(`/api/translations/${lang}`);
    if (!res.ok) {
      throw new Error("no remote");
    }
    return await res.json();
  } catch (e) {
    console.warn("Falling back to local translations:", e);
    return translations[lang] || translations["en"];
  }
}

// Apply translations to the page
// Select all elements with data-key attribute
const elementsToTranslate = document.querySelectorAll("[data-key]");
const titleElement        = document.getElementById("title-text");

async function applyTranslations(lang) {
  const dict = await fetchRemoteTranslations(lang);

  // Title
  titleElement.textContent = dict.titleText;

  // All others
  elementsToTranslate.forEach(el => {
    const key = el.dataset.key;
    el.textContent = dict[key] || translations["en"][key] || "";
  });
}

// Language dropdown
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = sessionStorage.getItem("language") || "en";
  applyTranslations(savedLang);
  document.getElementById("languageDropdown").textContent = savedLang.toUpperCase();

  document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", async e => {
      e.preventDefault();
      const lang = item.dataset.lang;
      sessionStorage.setItem("language", lang);
      document.getElementById("languageDropdown").textContent = lang.toUpperCase();
      await applyTranslations(lang);
    });
  });
});

// Dark mode toggle
const waveToggle = document.getElementById("wave-toggle-checkbox");
const isDarkMode = localStorage.getItem("dark-mode") === "true";
document.documentElement.classList.toggle("darkmode", isDarkMode);
waveToggle.checked = isDarkMode;

waveToggle.addEventListener("change", () => {
  const on = waveToggle.checked;
  document.documentElement.classList.toggle("darkmode", on);
  localStorage.setItem("dark-mode", on);
});

// Scroll animations
const scrollEls = document.querySelectorAll(".js-scroll");
const observer  = new IntersectionObserver(
  entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("scrolled");
        observer.unobserve(en.target);
      }
    });
  },
  { threshold: 0.2 }
);
scrollEls.forEach(el => observer.observe(el));


function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Run on page load and resize
setVH();
window.addEventListener('resize', setVH);

// Better scroll reveal with intersection observer
document.addEventListener('DOMContentLoaded', function() {
  const scrollElements = document.querySelectorAll('.js-scroll');
  
  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    const elementHeight = el.getBoundingClientRect().height;
    
    return (
      elementTop <= 
      ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
  };
  
  const displayScrollElement = (element) => {
    element.classList.add('scrolled');
  };
  
  const hideScrollElement = (element) => {
    element.classList.remove('scrolled');
  };
  
  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 90)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  };
  
  // Initialize
  handleScrollAnimation();
  
  // Throttle function for better performance
  let throttleTimer;
  const throttle = (callback, time) => {
    if (throttleTimer) return;
    throttleTimer = true;
    setTimeout(() => {
      callback();
      throttleTimer = false;
    }, time);
  };
  
  // Add scroll event listener
  window.addEventListener('scroll', () => {
    throttle(handleScrollAnimation, 250);
  });
  
  // System dark mode detection
  const darkModeToggle = document.getElementById('wave-toggle-checkbox');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Apply system preference on page load if toggle isn't explicitly set
  if (localStorage.getItem('darkMode') === null && prefersDarkMode.matches) {
    document.body.classList.add('darkmode');
    darkModeToggle.checked = true;
  }
  
  // Listen for system changes
  prefersDarkMode.addEventListener('change', (e) => {
    // Only apply if user hasn't manually set preference
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

document.documentElement.classList.add(('ontouchstart' in window) ? 'touch-device' : 'no-touch');

// Notify when offline/online
window.addEventListener("offline", () => {
  console.warn("Offline – using local translations.");
});
window.addEventListener("online", () => {
  console.info("Back online – will fetch translations from your API.");
});
