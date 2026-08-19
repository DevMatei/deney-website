import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Photo } from "../photos/usePhotos";
import {
  formatAperture,
  formatFocalLength,
  formatShutter,
  formatTakenAt,
} from "../photos/formatExif";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  ExternalLink,
  X,
} from "./Icons";
import content from "../data/content.json";

export function PhotoModal({
  photos,
  photo,
  onSelect,
  onClose,
}: {
  photos: Photo[];
  photo: Photo | null;
  onSelect: (photo: Photo) => void;
  onClose: () => void;
}) {
  const isOpen = photo !== null;
  const index = photo !== null ? photos.findIndex((p) => p.url === photo.url) : -1;
  const total = photos.length;
  const caption = photo?.meta?.caption;
  const closeRef = useRef<HTMLButtonElement>(null);
  const openedFromRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    openedFromRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      openedFromRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && total > 1) onSelect(photos[(index + 1) % total]);
      if (event.key === "ArrowLeft" && total > 1) onSelect(photos[(index - 1 + total) % total]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, index, total, photos, onSelect, onClose]);

  useEffect(() => {
    if (!isOpen || total < 2) return;
    for (const delta of [-1, 1]) {
      const adjacent = photos[(index + delta + total) % total];
      if (adjacent !== undefined) {
        const image = new Image();
        image.src = adjacent.url;
      }
    }
  }, [isOpen, index, total, photos]);

  const step = (delta: number) => {
    if (photo === null || total === 0) return;
    onSelect(photos[(index + delta + total) % total]);
  };

  return (
    <AnimatePresence>
      {isOpen && photo !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          <div
            className="flex items-center justify-between px-4 py-3 sm:px-6 shrink-0"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="text-sm font-bold tabular-nums text-white/60">
              {total > 0 ? `${index + 1} / ${total}` : ""}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={content.lightbox.close}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 px-4 pb-4 sm:px-6 sm:pb-6 lg:gap-6 lg:px-6">
            <div className="relative flex-1 min-h-0 flex items-center justify-center px-12 sm:px-20 lg:px-14">
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      step(-1);
                    }}
                    aria-label={content.lightbox.previous}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      step(1);
                    }}
                    aria-label={content.lightbox.next}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
                  >
                    <ArrowRight size={22} />
                  </button>
                </>
              )}
              <PhotoImage key={photo.url} photo={photo} />
              {caption !== undefined && (
                <p className="absolute bottom-4 left-1/2 z-10 w-full max-w-[540px] -translate-x-1/2 rounded-full bg-black/50 px-5 py-2 text-center text-sm font-bold text-white/95 backdrop-blur">
                  {caption}
                </p>
              )}
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              onClick={(event) => event.stopPropagation()}
              aria-label={content.lightbox.details}
              className="w-full lg:w-[340px] xl:w-[380px] shrink-0 overflow-y-auto rounded-2xl sm:rounded-3xl border border-[var(--outline-variant)]/60 bg-[var(--surface-container)] p-4 sm:p-5 shadow-2xl max-h-[32vh] lg:max-h-none"
            >
              <Details photo={photo} />
            </motion.aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PhotoImage({ photo }: { photo: Photo }) {
  const [loaded, setLoaded] = useState(false);
  const meta = photo.meta;

  return (
    <div
      className="relative flex items-center justify-center max-h-full max-w-full"
      onClick={(event) => event.stopPropagation()}
    >
      {meta?.blur !== undefined && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url(${meta.blur})`,
            filter: "blur(28px) saturate(1.2)",
            transform: "scale(1.25)",
            opacity: loaded ? 0 : 1,
            transition: "opacity 350ms ease",
          }}
        />
      )}
      <motion.img
        src={photo.url}
        alt={photo.alt}
        decoding="async"
        draggable={false}
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: loaded ? 1 : 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onLoad={() => setLoaded(true)}
        className="max-h-[52vh] lg:max-h-[calc(100dvh-6.5rem)] max-w-full object-contain rounded-xl sm:rounded-2xl shadow-2xl"
      />
    </div>
  );
}

function Details({ photo }: { photo: Photo }) {
  const meta = photo.meta;
  const taken = meta !== undefined ? formatTakenAt(meta.takenAt) : undefined;
  const camera = meta?.camera;
  const lens = meta?.lens;

  const settings: Array<[string, string | undefined]> = [
    [content.lightbox.aperture, formatAperture(meta?.aperture)],
    [content.lightbox.shutter, formatShutter(meta?.shutter)],
    [content.lightbox.focalLength, formatFocalLength(meta?.focalLength)],
    [content.lightbox.iso, meta?.iso != null ? `ISO ${meta.iso}` : undefined],
  ];
  const visibleSettings = settings.filter(
    (entry): entry is [string, string] => entry[1] !== undefined,
  );

  const dimensions =
    meta?.width !== undefined && meta?.height !== undefined
      ? `${meta.width} x ${meta.height} px`
      : undefined;
  const fileRows: Array<[string, string | undefined]> = [
    [content.lightbox.dimensions, dimensions],
  ];
  const visibleFiles = fileRows.filter(
    (entry): entry is [string, string] => entry[1] !== undefined,
  );

  if (taken === undefined && camera === undefined && lens === undefined && visibleSettings.length === 0 && visibleFiles.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-col gap-2.5 text-sm min-w-0">
          {taken !== undefined && (
            <span className="inline-flex items-center gap-2 opacity-80">
              <Calendar size={16} className="shrink-0 text-[var(--primary)]" />
              {taken}
            </span>
          )}
          {camera !== undefined && (
            <span className="inline-flex items-center gap-2 opacity-80">
              <Camera size={16} className="shrink-0 text-[var(--primary)]" />
              <span className="truncate">{camera}</span>
            </span>
          )}
          {lens !== undefined && <span className="pl-6 opacity-80">{lens}</span>}
        </div>
        <a
          href={photo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-bold text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors shrink-0"
        >
          {content.lightbox.fullSize}
          <ExternalLink size={14} />
        </a>
      </div>
      {visibleSettings.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest opacity-60 mb-2">
            {content.lightbox.shotSettings}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {visibleSettings.map(([label, value]) => (
              <StatCell key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      )}
      {visibleFiles.length > 0 && (
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-widest opacity-60 mb-2">
            {content.lightbox.fileInfo}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {visibleFiles.map(([label, value]) => (
              <StatCell key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--outline-variant)]/60 bg-[var(--surface-variant)]/60 px-3 py-2 min-w-0">
      <span className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">
        {label}
      </span>
      <span className="block text-sm font-bold truncate">{value}</span>
    </div>
  );
}
