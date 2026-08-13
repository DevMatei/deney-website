import { useEffect, useMemo, useState } from "react";
import type { Photo } from "./usePhotos";

const MIN_DURATION = 18;
const DURATION_SPREAD = 6;

interface ColumnConfig {
  photos: Photo[];
  duration: number;
  delay: number;
}

function useColumnCount() {
  const [count, setCount] = useState(8);
  useEffect(() => {
    const queries = [
      window.matchMedia("(min-width: 1200px)"),
      window.matchMedia("(min-width: 900px)"),
      window.matchMedia("(min-width: 600px)"),
    ];
    const update = () => {
      if (queries[0].matches) setCount(8);
      else if (queries[1].matches) setCount(7);
      else if (queries[2].matches) setCount(6);
      else setCount(5);
    };
    update();
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);
  return count;
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function sampleColumn(pool: Photo[], maxPerColumn: number): Photo[] {
  if (pool.length >= maxPerColumn) {
    return shuffled(pool).slice(0, maxPerColumn);
  }
  const result: Photo[] = [];
  while (result.length < maxPerColumn) {
    result.push(...shuffled(pool));
  }
  return result.slice(0, maxPerColumn);
}

export function Waterfall({
  photos,
  onSelect,
  maxPerColumn = 8,
}: {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
  maxPerColumn?: number;
}) {
  const columnCount = useColumnCount();

  const columns = useMemo<ColumnConfig[]>(() => {
    if (photos.length === 0) return [];
    return Array.from({ length: columnCount }, () => {
      const duration = MIN_DURATION + Math.random() * DURATION_SPREAD;
      const delay = -Math.random() * duration;
      return { photos: sampleColumn(photos, maxPerColumn), duration, delay };
    });
  }, [photos, columnCount, maxPerColumn]);

  if (columns.length === 0) return null;

  return (
    <div
      className="absolute inset-0 grid overflow-hidden px-2 py-1"
      style={{
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: "6px",
      }}
    >
      {columns.map((column, index) => (
        <div key={index} className="relative overflow-hidden rounded-2xl">
          <div
            className="rain-track flex flex-col"
            style={{
              animation: `waterfall ${column.duration}s linear ${column.delay}s infinite`,
            }}
          >
            {[...column.photos, ...column.photos].map((photo, itemIndex) => (
              <RainPhoto
                key={`${photo.url}-${itemIndex}`}
                photo={photo}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RainPhoto({
  photo,
  onSelect,
}: {
  photo: Photo;
  onSelect: (photo: Photo) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const meta = photo.meta;
  const ratio = meta?.width && meta?.height ? meta.width / meta.height : 3 / 2;

  return (
    <button
      type="button"
      aria-label={photo.alt}
      onClick={() => onSelect(photo)}
      className="relative w-full overflow-hidden rounded-2xl bg-[var(--surface-variant)] cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]"
      style={{ aspectRatio: String(ratio), marginBottom: "6px" }}
    >
      <img
        src={photo.bandUrl || photo.url}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width={meta?.width}
        height={meta?.height}
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms ease" }}
      />
    </button>
  );
}
