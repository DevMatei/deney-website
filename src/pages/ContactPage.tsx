import { useState } from "react";
import { Card } from "../components/Card";
import { PhotoModal } from "../components/PhotoModal";
import { WaterfallBand } from "../photos/WaterfallBand";
import { usePhotos } from "../photos/usePhotos";
import type { Photo } from "../photos/usePhotos";
import { ExternalLink } from "../components/MaterialIcon";
import XLogoIcon from "../components/XLogoIcon";
import content from "../data/content.json";

export function ContactPage() {
  const photos = usePhotos();
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <div className="flex-1 flex flex-col">
      <WaterfallBand photos={photos} onSelect={setSelected} height="46vh" defer>
        <div className="w-full max-w-[1080px]">
          <div className="text-[11px] font-expressive font-black uppercase tracking-widest opacity-60">
            {content.contact.eyebrow}
          </div>
          <h1 className="page-title font-expressive-bold">{content.contact.title}</h1>
          <p className="font-medium opacity-70 mt-2">{content.contact.description}</p>
        </div>
      </WaterfallBand>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <Card innerClassName="!p-8 sm:!p-10 w-full max-w-[480px] flex flex-col items-center text-center gap-4">
          <img
            src="/pfp.webp"
            alt={content.avatarAlt}
            className="w-24 h-24 rounded-full object-cover border-4 border-[var(--outline-variant)]"
          />
          <div className="text-[11px] font-expressive font-black uppercase tracking-widest opacity-60">
            {content.contact.eyebrow}
          </div>
          <div className="font-expressive-bold text-3xl uppercase tracking-tight">
            {content.contact.handle}
          </div>
          <p className="font-medium opacity-70 max-w-[360px]">
            {content.contact.description}
          </p>
          <a
            href={content.contact.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="m3-button-filled w-full"
          >
            {content.contact.openButton}
            <ExternalLink size={16} />
          </a>
          <a
            href={content.contact.xUrl}
            target="_blank"
            rel="noreferrer"
            className="m3-button-outlined w-full"
          >
            <XLogoIcon className="w-4 h-4" />
            {content.contact.xButton}
            <ExternalLink size={16} />
          </a>
        </Card>
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
