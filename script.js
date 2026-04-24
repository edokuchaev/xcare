const nav = document.getElementById('nav');

// Frosted-glass nav on scroll
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Smooth scroll with nav offset
const NAV_H = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Active nav link tracking
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// Scroll-triggered fade-in
const fadeTargets = [
  ...document.querySelectorAll('.section h2'),
  ...document.querySelectorAll('.cards-grid .card'),
  ...document.querySelectorAll('.endorsements-grid .card'),
  ...document.querySelectorAll('.expertise ul'),
  ...document.querySelectorAll('.mentor-quote blockquote'),
  ...document.querySelectorAll('.contact p'),
];

fadeTargets.forEach(el => el.classList.add('fade-in'));

// Stagger cards within each grid
document.querySelectorAll('.cards-grid, .endorsements-grid').forEach(grid => {
  grid.querySelectorAll('.card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
});

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    // Clean up both classes after animation so hover transitions aren't affected
    const delay = parseFloat(entry.target.style.transitionDelay || 0) * 1000;
    setTimeout(() => {
      entry.target.style.transitionDelay = '';
      entry.target.classList.remove('fade-in', 'visible');
    }, delay + 700);
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

fadeTargets.forEach(el => fadeObserver.observe(el));
