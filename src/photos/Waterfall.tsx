import { useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "./usePhotos";

const MIN_DURATION = 34;
const DURATION_SPREAD = 10;
const GRID_PADDING = 16;
const COLUMN_GAP = 6;
const PHOTO_MARGIN = 6;
const MIN_PHOTOS_PER_COLUMN = 4;
const MAX_PHOTOS_PER_COLUMN = 6;
const MAX_COLUMNS = 10;

interface ColumnConfig {
  photos: Photo[];
  duration: number;
  delay: number;
}

interface RandomColumn {
  pool: Photo[];
  duration: number;
  delay: number;
}

function useColumnCount() {
  const [count, setCount] = useState(5);
  useEffect(() => {
    const update = () => {
      setCount(Math.max(3, Math.min(10, Math.round(window.innerWidth / 340))));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
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
  const result: Photo[] = [];
  let total = 0;
  let index = 0;
  while (
    (total < targetHeight || result.length < MIN_PHOTOS_PER_COLUMN) &&
    result.length < MAX_PHOTOS_PER_COLUMN
  ) {
    const photo = pool[index % pool.length];
    index += 1;
    result.push(photo);
    total += photoHeight(photo, columnWidth);
  }
  return result;
}

export function Waterfall({
  photos,
  onSelect,
  paused = false,
}: {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
  paused?: boolean;
}) {
  const columnCount = useColumnCount();
  const gridRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      setBox((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      );
    };
    update();
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    });
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const randomized = useMemo<RandomColumn[]>(
    () =>
      Array.from({ length: MAX_COLUMNS }, () => {
        const duration = MIN_DURATION + Math.random() * DURATION_SPREAD;
        const delay = -Math.random() * duration;
        return { pool: shuffled(photos), duration, delay };
      }),
    [photos],
  );

  const columns = useMemo<ColumnConfig[]>(() => {
    if (photos.length === 0 || box.height === 0) return [];
    const columnWidth =
      (box.width - GRID_PADDING - COLUMN_GAP * (columnCount - 1)) / columnCount;
    return randomized.slice(0, columnCount).map(({ pool, duration, delay }) => {
      return {
        photos: sampleColumn(pool, columnWidth, box.height),
        duration,
        delay,
      };
    });
  }, [randomized, columnCount, box, photos.length]);

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
        <div key={index} className="relative overflow-hidden">
          <div
            className="rain-track flex flex-col"
            style={{
              animation: `waterfall ${column.duration}s linear ${column.delay}s infinite`,
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {column.photos.map((photo) => (
              <RainPhoto
                key={`${photo.url}-a`}
                photo={photo}
                onSelect={onSelect}
              />
            ))}
            {column.photos.map((photo) => (
              <RainPhoto
                key={`${photo.url}-b`}
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
        loading="lazy"
        fetchPriority="low"
        decoding="async"
        width={meta?.width}
        height={meta?.height}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </button>
  );
}
