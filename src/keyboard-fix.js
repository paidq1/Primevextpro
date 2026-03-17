const setVh = () => {
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setVh();

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setVh);
  window.visualViewport.addEventListener('scroll', setVh);
} else {
  window.addEventListener('resize', setVh);
}
