import { Waterfall } from "./Waterfall";
import type { Photo } from "./usePhotos";
import { useEffect, useRef, useState } from "react";

export function WaterfallBand({
  photos,
  onSelect,
  height = "48vh",
  scrim = "soft",
  defer = false,
  children,
}: {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
  height?: string;
  scrim?: "soft" | "strong";
  defer?: boolean;
  children?: React.ReactNode;
}) {
  const [ready, setReady] = useState(!defer);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!defer) return;
    const id = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(id);
  }, [defer]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      setInView(true);
      return;
    }
    const nearObserver = new IntersectionObserver(
      (entries) => setNear(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: "480px 0px" },
    );
    const viewObserver = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
    );
    nearObserver.observe(el);
    viewObserver.observe(el);
    return () => {
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    let id = 0;
    const onScroll = () => {
      setScrolling(true);
      window.clearTimeout(id);
      id = window.setTimeout(() => setScrolling(false), 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(id);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden shrink-0"
      style={{ height }}
    >
      {ready && near && (
        <Waterfall photos={photos} onSelect={onSelect} paused={!inView || scrolling} />
      )}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: scrim === "strong" ? "rgba(0, 0, 0, 0.45)" : "rgba(0, 0, 0, 0.28)",
          backgroundImage:
            "linear-gradient(to top, var(--surface), transparent 32%), linear-gradient(to bottom, var(--surface), transparent 28%)",
        }}
      />
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-y-auto px-4 md:px-10">
        {children}
      </div>
    </div>
  );
}
