import { useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "./usePhotos";

const MIN_DURATION = 18;
const DURATION_SPREAD = 6;
const GRID_PADDING = 16;
const COLUMN_GAP = 6;
const PHOTO_MARGIN = 6;
const MAX_PHOTOS_PER_COLUMN = 12;

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

function photoHeight(photo: Photo, columnWidth: number): number {
  const meta = photo.meta;
  const ratio = meta?.width && meta?.height ? meta.width / meta.height : 2 / 3;
  return columnWidth / ratio + PHOTO_MARGIN;
}

function sampleColumn(pool: Photo[], columnWidth: number, targetHeight: number): Photo[] {
  const order = shuffled(pool);
  const result: Photo[] = [];
  let total = 0;
  let index = 0;
  while (total < targetHeight && result.length < MAX_PHOTOS_PER_COLUMN) {
    const photo = order[index % order.length];
    index += 1;
    result.push(photo);
    total += photoHeight(photo, columnWidth);
  }
  return result;
}

export function Waterfall({
  photos,
  onSelect,
}: {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
}) {
  const columnCount = useColumnCount();
  const gridRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () => setBox({ width: el.clientWidth, height: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const columns = useMemo<ColumnConfig[]>(() => {
    if (photos.length === 0 || box.height === 0) return [];
    const columnWidth = (box.width - GRID_PADDING - COLUMN_GAP * (columnCount - 1)) / columnCount;
    return Array.from({ length: columnCount }, () => {
      const duration = MIN_DURATION + Math.random() * DURATION_SPREAD;
      const delay = -Math.random() * duration;
      return {
        photos: sampleColumn(photos, columnWidth, box.height),
        duration,
        delay,
      };
    });
  }, [photos, columnCount, box]);

  return (
    <div
      ref={gridRef}
      className="absolute inset-0 grid overflow-hidden px-2 py-1"
      style={{
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: `${COLUMN_GAP}px`,
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
      style={{ aspectRatio: String(ratio), marginBottom: `${PHOTO_MARGIN}px` }}
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
