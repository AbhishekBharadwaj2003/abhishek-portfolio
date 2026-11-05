// Multilingual name intro — shown once per browser tab.
(() => {
  const splash = document.getElementById('introSplash');
  const name = document.getElementById('introName');
  const progress = document.getElementById('introProgress');
  if (!splash || !name || !progress) return;
  const sequence = [
    { text: 'ABHISHEK', font: 'latin', label: 'ENGLISH' },
    { text: 'अभिषेक', font: 'devanagari', label: 'HINDI' },
    { text: 'অভিষেক', font: 'bengali', label: 'BENGALI' },
    { text: 'அபிஷேக்', font: 'tamil', label: 'TAMIL' },
    { text: 'అభిషేక్', font: 'telugu', label: 'TELUGU' },
    { text: 'أبهيشيك', font: 'arabic', label: 'ARABIC' },
    { text: 'アビシェーク', font: 'japanese', label: 'JAPANESE' },
    { text: '아비셰크', font: 'korean', label: 'KOREAN' }
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  const showFrame = () => {
    const frame = sequence[index];
    name.className = 'intro-name font-' + frame.font;
    name.textContent = frame.text;
    progress.style.width = ((index + 1) / sequence.length * 100) + '%';
    name.classList.remove('intro-pop');
    void name.offsetWidth;
    name.classList.add('intro-pop');
    index += 1;
  };
  if (reducedMotion || sessionStorage.getItem('ab-intro-seen') === '1') {
    splash.remove();
    return;
  }
  sessionStorage.setItem('ab-intro-seen', '1');
  showFrame();
  const interval = window.setInterval(() => {
    if (index < sequence.length) {
      showFrame();
    } else {
      window.clearInterval(interval);
      splash.classList.add('intro-splash-exit');
      window.setTimeout(() => splash.remove(), 750);
    }
  }, 500);
})();

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();
const revealTargets = document.querySelectorAll('.section-heading, .experience-card, .project-card, .journey-year, .beyond-card, .press-note, .cert-item, .about-content, .skills-panel');
revealTargets.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach(el => observer.observe(el));
} else revealTargets.forEach(el => el.classList.add('visible'));

// Open gallery photographs in a full-size lightbox without cropping.
const lightbox = document.getElementById('imageLightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lightboxImage) lightboxImage.src = '';
};
document.querySelectorAll('[data-lightbox]').forEach(img => {
  img.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || 'Expanded photograph';
    const caption = img.closest('figure')?.querySelector('figcaption')?.innerText || img.alt || '';
    if (lightboxCaption) lightboxCaption.textContent = caption.replace(/\s+/g, ' ').trim();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeLightbox(); });

// Compose the contact form into an email; no third-party form service/API is required.
document.getElementById('contactForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const subject = String(data.get('subject') || '').trim();
  const message = String(data.get('message') || '').trim();
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:abhishekbharadwaj120@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  const note = document.getElementById('formNote');
  if (note) note.textContent = 'Your email app should open with the message filled in. Please send it from there.';
});
