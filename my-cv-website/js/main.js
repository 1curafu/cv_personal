/* Dark mode toggle functionality */
const toggleButton = document.getElementById('dark-mode-toggle');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

/* Scroll reveal animations using Intersection Observer */
const scrollElements = document.querySelectorAll('.js-scroll');

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
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
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } else {
      hideScrollElement(el);
    }
  });
};

window.addEventListener('scroll', handleScrollAnimation);

/* Contact form basic validation */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent default form submission

  // Basic validation
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (name === '' || email === '' || message === '') {
    alert('Please fill in all fields.');
    return;
  }

  // Simulate successful submission
  alert('Thank you for your message!');
  contactForm.reset();
});