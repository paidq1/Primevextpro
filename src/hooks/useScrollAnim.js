import { useEffect, useRef } from "react";

export default function useScrollAnim() {
  useEffect(() => {
    const els = document.querySelectorAll(".scroll-anim");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
          else e.target.classList.remove("visible");
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
