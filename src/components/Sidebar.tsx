import { memo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/cn";
import { vibrate } from "../lib/vibration";
import { useTheme } from "../theme/ThemeContext";
import { Camera, ChevronLeft, ChevronRight, Home, Mail, User } from "./Icons";
import DiscordIcon from "./DiscordIcon";
import XLogoIcon from "./XLogoIcon";
import content from "../data/content.json";

export const NavItem = memo(
  ({
    glyph: Icon,
    text,
    isSelected,
    onSelect,
    isMini,
  }: {
    glyph: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    text: string;
    isSelected: boolean;
    onSelect: () => void;
    isMini?: boolean;
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.button
        layout="position"
        initial={false}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          vibrate.light();
          onSelect();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative group outline-none cursor-pointer font-black anim-gpu isolate flex items-center w-full sidebar-item rounded-2xl",
          isMini ? "justify-center py-2.5" : "justify-center gap-3 px-4 py-3",
          isSelected
            ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
            : "text-[var(--on-surface-variant)]",
        )}
      >
        <motion.div
          className="absolute inset-0 -z-20 rounded-2xl bg-[var(--surface-variant)]"
          initial={false}
          animate={{ opacity: isSelected ? 0 : isHovered ? 0.9 : 0 }}
          transition={{ duration: 0.1 }}
        />
        <div className="relative z-10 shrink-0 flex items-center justify-center w-6 h-6">
          <motion.div
            animate={{ scale: isSelected ? 1.1 : isHovered ? 1.06 : 1 }}
            style={{ color: "inherit" }}
          >
            <Icon size={22} strokeWidth={isSelected ? 2.5 : 2} />
          </motion.div>
        </div>
        <motion.span
          animate={{ opacity: isMini ? 0 : 1, maxWidth: isMini ? 0 : 200 }}
          transition={{ type: "spring", stiffness: 280, damping: 34 }}
          className="font-display tracking-[0.08em] text-[15px] uppercase relative z-10 font-black overflow-hidden whitespace-nowrap"
        >
          {text}
        </motion.span>
        <AnimatePresence>
          {isMini && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full ml-4 px-3 py-1.5 bg-[var(--on-surface)] text-[var(--surface)] text-xs font-bold rounded-xl z-50 whitespace-nowrap shadow-xl pointer-events-none"
            >
              {text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  },
);

NavItem.displayName = "NavItem";

export function Sidebar() {
  const { settings, updateSettings } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { key: "home", label: content.nav[0].label, path: content.nav[0].path, glyph: Home },
    { key: "photos", label: content.nav[1].label, path: content.nav[1].path, glyph: Camera },
    { key: "about", label: content.nav[2].label, path: content.nav[2].path, glyph: User },
    { key: "contact", label: content.nav[3].label, path: content.nav[3].path, glyph: Mail },
  ];

  const isMini = settings.sidebarCollapsed;
  const lastToggle = useRef(0);

  const toggleCollapsed = () => {
    const now = Date.now();
    if (now - lastToggle.current < 450) return;
    lastToggle.current = now;
    updateSettings({ sidebarCollapsed: !isMini });
  };

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: isMini ? 92 : 280 }}
      transition={{ type: "spring", stiffness: 220, damping: 38 }}
      className="hidden md:block sticky top-0 h-screen z-40 shrink-0"
    >
      <motion.div
        initial={false}
        animate={{
          padding: isMini ? "0.6rem" : "1.25rem",
          margin: "0.75rem",
          borderRadius: isMini ? "1.75rem" : "2rem",
          backdropFilter: "blur(20px)",
        }}
        transition={{ type: "spring", stiffness: 220, damping: 38 }}
        className="flex flex-col h-[calc(100dvh-1.5rem)] w-auto anim-gpu border-2 border-[var(--outline-variant)] bg-[var(--surface)]/85 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.45)]"
      >
        <div
          className={cn(
            "flex items-center isolate",
            isMini ? "justify-center mb-3" : "px-1 gap-3 mb-6",
          )}
        >
          <img
            src="/pfp.webp"
            alt={content.avatarAlt}
            className="w-12 h-12 max-w-none rounded-full object-cover shrink-0 border-2 border-[var(--outline-variant)]"
          />
          <motion.div
            animate={{ opacity: isMini ? 0 : 1, maxWidth: isMini ? 0 : 200 }}
            transition={{ type: "spring", stiffness: 280, damping: 34 }}
            className="overflow-hidden whitespace-nowrap min-w-0"
          >
            <div className="font-display text-2xl font-black tracking-tight leading-none">
              {content.site.name}
            </div>
            <div className="text-[10px] font-emphasis font-black uppercase tracking-[0.18em] opacity-60 mt-1.5">
              {content.site.role}
            </div>
          </motion.div>
        </div>

        <div
          id="sidebar-nav"
          className={cn(
            "flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1 min-h-0",
            isMini ? "items-center" : "px-1",
          )}
        >
          {navItems.map((item) => (
            <NavItem
              key={item.key}
              glyph={item.glyph}
              text={item.label}
              isSelected={location.pathname === item.path}
              onSelect={() => navigate(item.path)}
              isMini={isMini}
            />
          ))}
        </div>

        <div className={cn("mt-auto flex flex-col gap-1.5 pt-3", isMini ? "items-center" : "px-1")}>
          <div className={cn("flex gap-1.5", isMini ? "flex-col items-center" : "flex-row")}>
            <motion.button
              layout
              whileTap={{ scale: 0.96 }}
              onClick={() => window.open(content.contact.discordUrl, "_blank", "noreferrer")}
              aria-label={content.navbar.discordLabel}
              className={cn(
                "flex items-center justify-center rounded-2xl bg-[var(--surface-variant)] text-[var(--on-surface-variant)] hover:text-[var(--on-primary-container)] hover:bg-[var(--primary-container)] transition-colors cursor-pointer",
                isMini ? "w-11 h-11" : "flex-1 py-3",
              )}
            >
              <DiscordIcon className="w-5 h-5" />
            </motion.button>
            <motion.button
              layout
              whileTap={{ scale: 0.96 }}
              onClick={() => window.open(content.contact.xUrl, "_blank", "noreferrer")}
              aria-label={content.contact.xLabel}
              className={cn(
                "flex items-center justify-center rounded-2xl bg-[var(--surface-variant)] text-[var(--on-surface-variant)] hover:text-[var(--on-primary-container)] hover:bg-[var(--primary-container)] transition-colors cursor-pointer",
                isMini ? "w-11 h-11" : "flex-1 py-3",
              )}
            >
              <XLogoIcon className="w-5 h-5" />
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={toggleCollapsed}
            aria-label={isMini ? content.sidebar.expandLabel : content.sidebar.collapseLabel}
            className={cn(
              "flex items-center justify-center rounded-2xl bg-[var(--surface-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-colors cursor-pointer py-3",
              isMini ? "w-11 h-11" : "w-full gap-2",
            )}
          >
            {isMini ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            <motion.span
              animate={{ opacity: isMini ? 0 : 1, maxWidth: isMini ? 0 : 200 }}
              transition={{ type: "spring", stiffness: 280, damping: 34 }}
              className="text-[11px] font-black uppercase tracking-[0.14em] overflow-hidden whitespace-nowrap"
            >
              {isMini ? content.sidebar.expandLabel : content.sidebar.collapseLabel}
            </motion.span>
          </motion.button>
        </div>
      </motion.div>
    </motion.aside>
  );
}
