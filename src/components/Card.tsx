import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { useTheme } from "../theme/ThemeContext";
import { TiltCard } from "./TiltCard";

export function Card({
  children,
  className,
  innerClassName,
  delay = 0,
  onClick,
  noDefaultStyles = false,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  noDefaultStyles?: boolean;
}) {
  const { settings } = useTheme();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (settings.disableAnimations || delay === 0) {
      setShouldAnimate(true);
      return;
    }
    const timer = setTimeout(() => setShouldAnimate(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay, settings.disableAnimations]);

  const initialValues = settings.disableAnimations
    ? false
    : { opacity: 0, y: 20, scale: 0.95 };

  return (
    <TiltCard
      onClick={onClick}
      className={className}
      innerClassName={cn(
        !noDefaultStyles &&
          "panel overflow-hidden cursor-default relative border border-[var(--outline-variant)]",
        onClick && "cursor-pointer",
        innerClassName,
      )}
      initial={initialValues}
      animate={
        shouldAnimate || settings.disableAnimations
          ? { opacity: 1, y: 0, scale: 1 }
          : initialValues
      }
      transition={
        settings.disableAnimations
          ? { duration: 0 }
          : { type: "spring", stiffness: 700, damping: 28, mass: 0.8 }
      }
    >
      {children}
    </TiltCard>
  );
}
