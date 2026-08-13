import { useState } from "react";
import { Card } from "../components/Card";
import { PhotoModal } from "../components/PhotoModal";
import { WaterfallBand } from "../photos/WaterfallBand";
import { usePhotos } from "../photos/usePhotos";
import type { Photo } from "../photos/usePhotos";
import content from "../data/content.json";

export function AboutPage() {
  const photos = usePhotos();
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <div className="flex-1 flex flex-col">
      <WaterfallBand photos={photos} onSelect={setSelected} height="46vh" defer>
        <div className="w-full max-w-[1080px]">
          <div className="text-[11px] font-expressive font-black uppercase tracking-widest opacity-60">
            {content.about.eyebrow}
          </div>
          <h1 className="page-title font-expressive-bold">{content.about.title}</h1>
          <p className="font-medium opacity-70 mt-2">{content.about.description}</p>
        </div>
      </WaterfallBand>

      <div className="px-4 md:px-10 pt-10 md:pt-14 pb-12 w-full max-w-[820px] mx-auto">
        <blockquote className="border-l-[6px] border-[var(--primary)] pl-8 pr-4 py-4 italic font-expressive-bold text-2xl sm:text-3xl leading-snug mb-8">
          {content.about.quote}
        </blockquote>
        <p className="font-medium text-lg leading-[1.9] opacity-85 mb-10">
          {content.about.intro}
        </p>
        {content.about.sections.map((section, index) => (
          <Card key={section.heading} innerClassName="!p-8 mb-4" delay={0.08 * index}>
            <div className="font-expressive-bold text-7xl leading-none tracking-tighter text-[var(--primary)]">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h2 className="font-expressive-bold text-2xl uppercase tracking-tight mt-3 mb-2">
              {section.heading}
            </h2>
            <p className="font-medium text-base leading-relaxed opacity-85">
              {section.body}
            </p>
          </Card>
        ))}
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
