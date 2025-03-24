const waveToggleCheckbox = document.getElementById("wave-toggle-checkbox"); // Dark mode toggle checkbox

const isDarkMode = localStorage.getItem("dark-mode") === "true"; // Check if dark mode is enabled
document.documentElement.classList.toggle("darkmode", isDarkMode);
waveToggleCheckbox.checked = isDarkMode;

// Listen for changes to the checkbox
waveToggleCheckbox.addEventListener("change", () => {
  const checked = waveToggleCheckbox.checked;
  document.documentElement.classList.toggle("darkmode", checked);
  localStorage.setItem("dark-mode", checked);
});


// Scroll animation
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


// Language translation
/*const translations = {
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
  },
  uk: {
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
  },
};
*/

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

// Apply the default language
const defaultLang = "en";
applyTranslations(defaultLang);
document.getElementById("languageDropdown").textContent = defaultLang.toUpperCase();

// Listen for changes to the dropdown
document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const lang = item.getAttribute("data-lang");

    // Update the dropdown text
    document.getElementById("languageDropdown").textContent = lang.toUpperCase();

    // Apply the translation
    applyTranslations(lang);
  });
});