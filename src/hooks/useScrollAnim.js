import { useEffect } from "react";

export default function useScrollAnim() {
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const els = document.querySelectorAll(".scroll-anim");

    // Make elements already in view visible on load
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("visible");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY >= lastScrollY;
        lastScrollY = currentScrollY;

        entries.forEach((e) => {
          if (e.isIntersecting && scrollingDown) {
            e.target.classList.add("visible");
          } else if (!e.isIntersecting && !scrollingDown) {
            e.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.05 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
