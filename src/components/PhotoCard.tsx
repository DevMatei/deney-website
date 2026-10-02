import { useState } from "react";
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
    <button
      type="button"
      onClick={() => onSelect(photo)}
      aria-label={photo.alt}
      className={cn(
        "photo-card group relative w-full overflow-hidden rounded-[28px] bg-[var(--surface-variant)] cursor-pointer outline-none",
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
            opacity: loaded ? 0 : 1,
            transition: "opacity 200ms ease",
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
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 200ms ease" }}
      />
      <span aria-hidden="true" className="photo-state absolute inset-0 pointer-events-none" />
      {label !== undefined && (
        <span className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[var(--surface-container)] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      )}
    </button>
  );
}
