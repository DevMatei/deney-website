import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Photo, PhotoMeta } from "../photos/usePhotos";
import {
  formatAperture,
  formatFocalLength,
  formatShutter,
  formatTakenAt,
} from "../photos/formatExif";
import { ArrowLeft, ArrowRight, X } from "./MaterialIcon";

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
  const index = photo !== null ? photos.findIndex((p) => p.url === photo.url) : -1;
  const total = photos.length;

  useEffect(() => {
    if (photo === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && total > 1) onSelect(photos[(index + 1) % total]);
      if (event.key === "ArrowLeft" && total > 1) onSelect(photos[(index - 1 + total) % total]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photo, index, total, photos, onSelect, onClose]);

  const step = (delta: number) => {
    if (total === 0 || photo === null) return;
    onSelect(photos[(index + delta + total) % total]);
  };

  return (
    <AnimatePresence>
      {photo !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-3xl rounded-[2rem] border-2 border-[var(--outline-variant)] bg-[var(--surface-container)] shadow-[0_40px_90px_-24px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-2">
              <div className="text-[11px] font-expressive font-black uppercase tracking-[0.18em] opacity-60">
                {total > 0 ? `${index + 1} / ${total}` : ""}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--surface-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative px-3 sm:px-5">
              <div className="relative rounded-[1.5rem] overflow-hidden bg-black/30 flex items-center justify-center">
                <PhotoImage key={photo.url} photo={photo} />
                {total > 1 && (
                  <>
                    <button
                      onClick={() => step(-1)}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--surface)]/70 backdrop-blur text-[var(--on-surface)] hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      onClick={() => step(1)}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--surface)]/70 backdrop-blur text-[var(--on-surface)] hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition-colors cursor-pointer"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="px-4 sm:px-5 py-4">
              {photo.meta !== undefined && <MetaList meta={photo.meta} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PhotoImage({ photo }: { photo: Photo }) {
  const [loaded, setLoaded] = useState(false);
  const meta = photo.meta;

  return (
    <div className="relative w-full flex justify-center">
      {meta?.blur !== undefined && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${meta.blur})`,
            filter: "blur(24px) saturate(1.2)",
            transform: "scale(1.2)",
            opacity: loaded ? 0 : 1,
            transition: "opacity 400ms ease",
          }}
        />
      )}
      <img
        src={photo.url}
        alt={photo.alt}
        className="max-w-full max-h-[68vh] object-contain block relative"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms ease" }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function MetaList({ meta }: { meta: PhotoMeta }) {
  const rows: Array<[string, string]> = [
    ["Camera", meta.camera],
    ["Lens", meta.lens],
    ["Focal length", formatFocalLength(meta.focalLength)],
    ["Aperture", formatAperture(meta.aperture)],
    ["Shutter speed", formatShutter(meta.shutter)],
    ["ISO", meta.iso != null ? `ISO ${meta.iso}` : undefined],
    ["Taken", formatTakenAt(meta.takenAt)],
  ].filter((entry): entry is [string, string] => entry[1] !== undefined);

  if (rows.length === 0) return null;

  return (
    <dl className="m-0 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 border-t border-[var(--outline-variant)]/50 pt-4">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-[10px] font-expressive font-black uppercase tracking-[0.16em] opacity-50">
            {label}
          </dt>
          <dd className="m-0 mt-0.5 text-sm font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
