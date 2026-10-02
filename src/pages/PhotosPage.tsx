import { useState } from "react";
import { ArrowUp } from "../components/Icons";
import { PhotoCard } from "../components/PhotoCard";
import { PhotoModal } from "../components/PhotoModal";
import { WaterfallBand } from "../photos/WaterfallBand";
import { usePhotos } from "../photos/usePhotos";
import type { Photo } from "../photos/usePhotos";
import content from "../data/content.json";

export function PhotosPage() {
  const photos = usePhotos();
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <div className="flex-1 flex flex-col">
      <WaterfallBand photos={photos} onSelect={setSelected} height="46vh" defer>
        <div className="w-full max-w-[1080px]">
          <div className="text-[11px] font-emphasis font-black uppercase tracking-widest opacity-60">
            {content.photos.eyebrow}
          </div>
          <h1 className="page-heading font-emphasis-bold">{content.photos.title}</h1>
          <p className="font-medium opacity-70 mt-2">{content.photos.description}</p>
        </div>
      </WaterfallBand>

      <div className="px-4 md:px-10 pt-8 md:pt-12 pb-6 w-full max-w-[1080px] mx-auto">
        {photos.length === 0 ? (
          <div className="border border-dashed border-[var(--outline)] rounded-[28px] p-12 text-center">
            <p className="font-medium opacity-60">{content.photos.empty}</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:balance]">
            {photos.map((photo, index) => (
              <div key={photo.url} className="photo-item mb-4 break-inside-avoid">
                <PhotoCard
                  photo={photo}
                  onSelect={setSelected}
                  eager={index === 0}
                  priority={index === 0}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mb-4 break-inside-avoid w-full rounded-[28px] bg-[var(--primary-container)] text-[var(--on-primary-container)] p-8 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:brightness-105 active:scale-[0.98] transition-[filter,transform]"
              style={{ aspectRatio: "3 / 4" }}
            >
              <ArrowUp size={28} />
              <div className="text-[11px] font-emphasis font-black uppercase tracking-widest opacity-70">
                {content.photos.endCard.title}
              </div>
              <div className="text-sm font-bold opacity-80 max-w-[220px]">
                {content.photos.endCard.body}
              </div>
              <div className="btn-primary !px-5 !py-2 text-sm">
                {content.photos.endCard.button}
              </div>
            </button>
          </div>
        )}
        {photos.length > 0 && (
          <div className="flex justify-center mt-4 mb-2">
            <span className="px-4 py-1.5 rounded-full bg-[var(--surface-container)] text-[var(--on-surface-variant)] text-xs font-bold uppercase tracking-widest">
              {photos.length} {content.photos.countSuffix}
            </span>
          </div>
        )}
      </div>

      <PhotoModal
        photos={photos}
        photo={selected}
        onSelect={setSelected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
