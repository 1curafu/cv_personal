// Dark Mode Toggle Code
const waveToggleCheckbox = document.getElementById("wave-toggle-checkbox"); // Dark mode toggle checkbox

// Check if dark mode is enabled (stored in localStorage)
const isDarkMode = localStorage.getItem("dark-mode") === "true";
document.documentElement.classList.toggle("darkmode", isDarkMode);
waveToggleCheckbox.checked = isDarkMode;

// Listen for changes to the dark mode checkbox
waveToggleCheckbox.addEventListener("change", () => {
  const checked = waveToggleCheckbox.checked;
  document.documentElement.classList.toggle("darkmode", checked);
  localStorage.setItem("dark-mode", checked);
});


// Scroll Animation Code
const scrollElements = document.querySelectorAll(".js-scroll");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("scrolled");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

scrollElements.forEach((el) => observer.observe(el));


// Language Translation Code
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
    timelineFirZstDescription: "Description of experience one.",
    timelineFirstDate: "Date of experience one.",
    timelineSecondName: "Experience Two",
    timelineSecondDescription: "Description of experience two.",
    timelineSecondDate: "Date of experience two."
  }
};

const elementsToTranslate = document.querySelectorAll("[data-key]");
const titleElement = document.getElementById("title-text");

function applyTranslations(lang) {
  titleElement.textContent =
    translations[lang].titleText || translations["en"].titleText;

  elementsToTranslate.forEach((el) => {
    const key = el.getAttribute("data-key");
    el.textContent = translations[lang][key] || translations["en"][key];
  });
}

// Load saved language from sessionStorage or default to "en"
const savedLang = sessionStorage.getItem("language") || "en";
applyTranslations(savedLang);
document.getElementById("languageDropdown").textContent = savedLang.toUpperCase();

// Listen for changes to the language dropdown
document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const lang = item.getAttribute("data-lang");
    
    // Update the dropdown text and apply the translation
    document.getElementById("languageDropdown").textContent = lang.toUpperCase();
    applyTranslations(lang);
    
    // Save the selected language to sessionStorage
    sessionStorage.setItem("language", lang);
  });
});