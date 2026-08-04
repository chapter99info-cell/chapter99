import { useEffect, useRef } from 'react';

/** IntersectionObserver fade-up matching the mockup's .fadeup behavior. */
export function useFadeUp<T extends HTMLElement = HTMLDivElement>(delayIndex = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transitionDelay = `${(delayIndex % 6) * 0.08}s`;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('show');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delayIndex]);

  return ref;
}
