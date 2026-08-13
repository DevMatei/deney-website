import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { TargetAndTransition, VariantLabels } from "motion/react";
import { cn } from "../lib/cn";
import { useTheme } from "../theme/ThemeContext";

export function TiltContainer({
  children,
  className,
  innerClassName,
  onClick,
  initial,
  animate,
  transition,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  initial?: TargetAndTransition | VariantLabels | boolean;
  animate?: TargetAndTransition | VariantLabels | boolean;
  transition?: Record<string, unknown>;
}) {
  const { settings } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const useTilt = settings.bentoTilt && !settings.disableAnimations;

  useEffect(() => {
    if (!useTilt) {
      const card = cardRef.current;
      if (card) card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    }
  }, [useTilt]);

  const applyTilt = (rx: number, ry: number) => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  const handleMouseEnter = () => {
    if (!useTilt || window.innerWidth < 768) return;
    rectRef.current = wrapperRef.current?.getBoundingClientRect() || null;
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!useTilt || window.innerWidth < 768) return;
    let rect = rectRef.current;
    if (!rect) {
      rect = wrapperRef.current?.getBoundingClientRect() || null;
      rectRef.current = rect;
    }
    if (!rect) return;
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    applyTilt(-((py - centerY) / centerY) * 6, ((px - centerX) / centerX) * 6);
    const card = cardRef.current;
    if (card) {
      card.style.setProperty("--glare-x", `${(px / rect.width) * 100}%`);
      card.style.setProperty("--glare-y", `${(py / rect.height) * 100}%`);
      card.style.setProperty("--glare-opacity", "1");
    }
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    applyTilt(0, 0);
    const card = cardRef.current;
    if (card) card.style.setProperty("--glare-opacity", "0");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <motion.div
      ref={wrapperRef}
      className={cn("tilt-active", className)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? "Interactive card" : undefined}
      initial={initial}
      animate={animate}
      transition={transition}
      {...props}
    >
      <div
        ref={cardRef}
        className={cn("tilt-card relative overflow-hidden", innerClassName)}
        style={{
          transition: "transform 120ms ease-out",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
