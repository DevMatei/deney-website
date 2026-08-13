import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "../lib/cn";
import { haptic } from "../lib/haptics";
import { useTheme } from "../theme/ThemeContext";

interface NavItem {
  key: string;
  glyph: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
}

const PILL_SPRING = { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.7 };
const ACTIVE_PILL_SPRING = { type: "spring" as const, stiffness: 520, damping: 36, mass: 0.5 };
const ICON_SPRING = { type: "spring" as const, stiffness: 520, damping: 38, mass: 0.45 };
const LABEL_SPRING = { type: "spring" as const, stiffness: 480, damping: 38, mass: 0.45 };
const NavPillItem = memo(
  ({
    item,
    isActive,
    onSelect,
    highHz,
  }: {
    item: NavItem;
    isActive: boolean;
    onSelect: () => void;
    highHz: boolean;
  }) => {
    const [pressed, setPressed] = useState(false);
    const Icon = item.glyph;
    const spring = highHz ? { ...PILL_SPRING, stiffness: 600, damping: 36 } : PILL_SPRING;
    const handleClick = useCallback(() => {
      haptic.light();
      onSelect();
    }, [onSelect]);

    return (
      <motion.button
        layout
        onClick={handleClick}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        animate={pressed ? { scale: 0.92, y: 1 } : { scale: 1, y: 0 }}
        transition={pressed ? { duration: 0.08 } : spring}
        className={cn(
          "relative flex items-center justify-center outline-none cursor-pointer shrink-0 select-none",
          isActive
            ? "gap-2 px-4 py-2.5 rounded-full max-[359px]:px-3"
            : "w-10 h-10 rounded-full max-[359px]:w-9 max-[359px]:h-9",
        )}
        aria-label={item.label}
        aria-pressed={isActive}
      >
        {isActive && (
          <motion.div
            layout
            layoutId="mobile-nav-active-pill"
            initial={false}
            animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
            transition={ACTIVE_PILL_SPRING}
            className="absolute inset-0 rounded-full z-0 pointer-events-none"
            style={{ backgroundColor: "var(--primary)" }}
          />
        )}
        <motion.div
          animate={{ scale: isActive ? 1.18 : 1, rotate: isActive ? -8 : 0 }}
          transition={ICON_SPRING}
          style={{ color: isActive ? "var(--on-primary)" : "var(--on-surface)" }}
          className="relative z-[1] shrink-0 flex items-center justify-center"
        >
          <Icon size={20} strokeWidth={isActive ? 2.8 : 2} />
        </motion.div>
        <AnimatePresence>
          {isActive && (
            <motion.span
              layout
              initial={{ opacity: 0, maxWidth: 0, x: -8 }}
              animate={{ opacity: 1, maxWidth: 200, x: 0 }}
              exit={{ opacity: 0, maxWidth: 0, x: -8 }}
              transition={{ ...LABEL_SPRING, duration: 0.24 }}
              className="relative z-[1] inline-block text-[11px] font-expressive font-black uppercase tracking-widest italic whitespace-nowrap overflow-hidden pr-1"
              style={{ color: "var(--on-primary)" }}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  },
);

NavPillItem.displayName = "NavPillItem";

export const MobileFloatingNav = memo(
  ({
    items,
    activePage,
    onSelect,
  }: {
    items: NavItem[];
    activePage: string;
    onSelect: (key: string) => void;
  }) => {
    const { settings } = useTheme();
    const highHz = settings.highHz;

    const PILL_H = 60;
    const [narrow, setNarrow] = useState(() =>
      window.matchMedia("(max-width: 359px)").matches,
    );
    const SIDE_PAD = narrow ? 20 : Math.round(PILL_H * 0.55);

    useEffect(() => {
      const mq = window.matchMedia("(max-width: 359px)");
      const onChange = () => setNarrow(mq.matches);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }, []);

    const prevPage = useRef(activePage);
    const [bounce, setBounce] = useState(false);

    useEffect(() => {
      if (prevPage.current !== activePage) {
        prevPage.current = activePage;
        setBounce(true);
        const t = setTimeout(() => setBounce(false), 420);
        return () => clearTimeout(t);
      }
    }, [activePage]);

    const pillSpring = highHz ? { ...PILL_SPRING, stiffness: 600, damping: 36 } : PILL_SPRING;

    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 140 }}
        className="fixed z-40 flex items-center md:hidden"
        style={{
          bottom: `calc(env(safe-area-inset-bottom, 12px) + 12px)`,
          left: SIDE_PAD,
          right: SIDE_PAD,
          gap: 10,
        }}
      >
        <motion.div
          layout
          animate={
            bounce ? { y: [-6, 0], scale: [1.04, 1] } : { y: 0, scale: 1 }
          }
          transition={
            bounce
              ? {
                  y: {
                    type: "spring",
                    stiffness: highHz ? 900 : 700,
                    damping: highHz ? 22 : 18,
                    mass: 0.5,
                  },
                  scale: {
                    type: "spring",
                    stiffness: highHz ? 700 : 550,
                    damping: highHz ? 18 : 15,
                    mass: 0.4,
                  },
                }
              : pillSpring
          }
          className="flex-1 flex items-center justify-around relative"
          style={{
            height: PILL_H,
            borderRadius: PILL_H / 2,
            backgroundColor: "var(--surface-container)",
            paddingLeft: 8,
            paddingRight: 8,
            boxShadow: "0 8px 24px -6px rgba(0,0,0,0.18), 0 2px 6px -2px rgba(0,0,0,0.10)",
            border: "1px solid var(--outline-variant)",
          }}
        >
          <MotionConfig reducedMotion={settings.disableAnimations ? "always" : "user"}>
            {items.map((item) => (
              <NavPillItem
                key={item.key}
                item={item}
                isActive={activePage === item.key}
                onSelect={() => onSelect(item.key)}
                highHz={highHz}
              />
            ))}
          </MotionConfig>
        </motion.div>

      </motion.div>
    );
  },
);

MobileFloatingNav.displayName = "MobileFloatingNav";
