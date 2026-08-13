import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Photo, PhotoMeta } from "../photos/usePhotos";
import {
  formatAperture,
  formatFocalLength,
  formatShutter,
  formatTakenAt,
} from "../photos/formatExif";
import { X } from "./MaterialIcon";

export function PhotoModal({
  photo,
  onClose,
}: {
  photo: Photo | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!photo) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photo, onClose]);

  return (
    <AnimatePresence>
      {photo !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl m3-card !p-4 sm:!p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-end mb-3">
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--surface-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="rounded-3xl overflow-hidden bg-black/20 flex justify-center">
              <img
                src={photo.url}
                alt={photo.alt}
                className="max-w-full max-h-[60vh] object-contain block"
              />
            </div>
            {photo.meta !== undefined && <MetaList meta={photo.meta} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
    <dl className="mt-5 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-4 gap-y-1.5">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-sm font-bold opacity-60 uppercase tracking-wider">{label}</dt>
          <dd className="m-0 text-base font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
