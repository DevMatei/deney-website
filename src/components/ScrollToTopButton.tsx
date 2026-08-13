import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "./Icons";
import { cn } from "../lib/cn";
import { vibrate } from "../lib/vibration";
import { useTheme } from "../theme/ThemeContext";
import content from "../data/content.json";

export function ScrollToTopButton({ isMobile }: { isMobile: boolean }) {
  const { settings } = useTheme();
  const [showTop, setShowTop] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setShowTop(current > 400);
      if (current <= 400) {
        setScrollDirection("up");
      } else {
        const diff = current - lastScrollY.current;
        if (diff > 10) setScrollDirection("down");
        else if (diff < -10) setScrollDirection("up");
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const visible = showTop && (!isMobile || scrollDirection === "up");

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.08, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            vibrate.light();
            window.scrollTo({ top: 0, behavior: settings.disableAnimations ? "auto" : "smooth" });
          }}
          aria-label={content.footer.backToTop}
          className={cn(
            "fixed z-40 w-14 h-14 flex items-center justify-center rounded-[32%] bg-[var(--primary)] text-[var(--on-primary)] shadow-xl cursor-pointer outline-none",
            "right-5",
            isMobile ? "bottom-24" : "bottom-5",
          )}
        >
          <ArrowUp size={26} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
