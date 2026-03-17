// Prevent mobile keyboard from resizing layout
const fix = () => {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty('--real-vh', `${vh}px`);
};

fix();
window.addEventListener('resize', fix);
window.addEventListener('orientationchange', () => setTimeout(fix, 300));

// Scroll active input into view when keyboard opens
document.addEventListener('focusin', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
});
