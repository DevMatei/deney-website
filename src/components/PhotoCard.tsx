import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/cn";
import type { Photo } from "../photos/usePhotos";

export function PhotoCard({
  photo,
  onSelect,
  ratio,
  eager = false,
  priority = false,
  fill = false,
  label,
}: {
  photo: Photo;
  onSelect: (photo: Photo) => void;
  ratio?: number;
  eager?: boolean;
  priority?: boolean;
  fill?: boolean;
  label?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const meta = photo.meta;
  const naturalRatio = meta?.width && meta?.height ? meta.width / meta.height : undefined;
  const aspect = ratio ?? naturalRatio ?? 3 / 4;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(photo)}
      aria-label={photo.alt}
      className={cn(
        "photo-card group relative w-full overflow-hidden rounded-3xl border-4 border-[var(--outline-variant)] bg-[var(--surface-variant)] cursor-pointer outline-none hover:border-[var(--primary)] transition-colors",
        fill && "h-full",
      )}
      style={fill ? undefined : { aspectRatio: String(aspect) }}
    >
      {meta?.blur !== undefined && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${meta.blur})`,
            filter: "blur(16px) saturate(1.2)",
            transform: "scale(1.15)",
            opacity: loaded ? 0 : 1,
            transition: "opacity 300ms ease",
          }}
        />
      )}
      <img
        src={photo.url}
        alt=""
        loading={eager ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        width={meta?.width}
        height={meta?.height}
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms ease" }}
      />
      {label !== undefined && (
        <span className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[var(--surface)]/70 backdrop-blur text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      )}
    </motion.button>
  );
}
