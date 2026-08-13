import { Waterfall } from "./Waterfall";
import type { Photo } from "./usePhotos";
import { useEffect, useState } from "react";

export function WaterfallBand({
  photos,
  onSelect,
  height = "48vh",
  scrim = "soft",
  maxPerColumn = 4,
  defer = false,
  children,
}: {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
  height?: string;
  scrim?: "soft" | "strong";
  maxPerColumn?: number;
  defer?: boolean;
  children?: React.ReactNode;
}) {
  const [ready, setReady] = useState(!defer);

  useEffect(() => {
    if (!defer) return;
    const id = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(id);
  }, [defer]);

  return (
    <div
      className="relative overflow-hidden shrink-0"
      style={{ height }}
    >
      {ready && (
        <Waterfall photos={photos} onSelect={onSelect} maxPerColumn={maxPerColumn} />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
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
