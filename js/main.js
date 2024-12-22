// Hamburger Menu Toggle (for mobile)
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu if link clicked
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  });
});

// Hero background rotation
const heroSection = document.querySelector('.hero');

// We want 7 rotating images, each a project thumb:
const heroImages = [
  'images/project1-thumb.jpg',
  'images/project2-thumb.jpg',
  'images/project3-thumb.jpg',
  'images/project4-thumb.jpg',
  'images/project5-thumb.jpg',
  'images/project6-thumb.jpg',
  'images/project7-thumb.jpg'
];

let currentIndex = 0;

// Set the initial background 
heroSection.style.background = `url('${heroImages[currentIndex]}') center center/cover no-repeat`;
heroSection.style.backgroundSize = 'cover';

// Rotate every 5 seconds
setInterval(() => {
  currentIndex = (currentIndex + 1) % heroImages.length;
  heroSection.style.background = `url('${heroImages[currentIndex]}') center center/cover no-repeat`;
  heroSection.style.backgroundSize = 'cover';
}, 5000);