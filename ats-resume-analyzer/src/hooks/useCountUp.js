import { useEffect, useState } from "react";

export function useCountUp(target, duration = 1600, delay = 400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = null;
    let raf;
    const startTime = performance.now() + delay;

    function step(timestamp) {
      if (timestamp < startTime) {
        raf = requestAnimationFrame(step);
        return;
      }
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);

  return value;
}
