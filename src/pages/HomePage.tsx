import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "../components/MaterialIcon";
import { Card } from "../components/Card";
import { PhotoCard } from "../components/PhotoCard";
import { PhotoModal } from "../components/PhotoModal";
import { WaterfallBand } from "../photos/WaterfallBand";
import { usePhotos } from "../photos/usePhotos";
import type { Photo } from "../photos/usePhotos";
import DiscordIcon from "../components/DiscordIcon";
import content from "../data/content.json";

export function HomePage() {
  const navigate = useNavigate();
  const photos = usePhotos();
  const featured = photos.slice(0, 4);
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <div className="flex-1 flex flex-col">
      <WaterfallBand
        photos={photos}
        onSelect={setSelected}
        height="calc(100svh - 0px)"
        scrim="strong"
        maxPerColumn={4}
        defer
      >
        <div className="w-full max-w-[1080px] pointer-events-none">
          <div className="m3-card !p-6 sm:!p-10 md:!p-14 text-left pointer-events-auto relative">
            <div className="m3-chip !py-1.5 mb-6 inline-flex">
              {content.home.hero.eyebrow}
            </div>
            <h1 className="font-expressive-bold text-[5.5rem] sm:text-[8rem] leading-[1] tracking-tighter text-[var(--on-surface)] pb-2">
              {content.home.hero.title}
            </h1>
            <p className="font-expressive italic text-lg sm:text-2xl font-bold opacity-70 mt-6 max-w-[620px]">
              {content.home.hero.tagline}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button
                type="button"
                className="m3-button-filled"
                onClick={() => navigate("/photos")}
              >
                {content.home.hero.primaryCta}
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="m3-button-tonal"
                onClick={() => navigate("/about")}
              >
                {content.home.hero.secondaryCta}
              </button>
            </div>
          </div>
        </div>
      </WaterfallBand>

      <section className="px-4 md:px-10 pt-10 md:pt-14 pb-8 w-full max-w-[1080px] mx-auto">
        <div className="flex items-end justify-between mb-4">
          <div className="text-[11px] font-expressive font-black uppercase tracking-widest opacity-60">
            {content.home.featuredLabel}
          </div>
          <button
            type="button"
            onClick={() => navigate("/photos")}
            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          >
            {content.home.featuredViewAll}
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.length > 0 ? (
            <>
              <div className="col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto">
                <PhotoCard photo={featured[0]} onSelect={setSelected} fill label="01" />
              </div>
              <div className="col-span-2 aspect-[21/10]">
                <PhotoCard photo={featured[1]} onSelect={setSelected} fill label="02" />
              </div>
              <div className="col-span-1 aspect-square">
                <PhotoCard photo={featured[2]} onSelect={setSelected} fill label="03" />
              </div>
              <div className="col-span-1 aspect-square">
                <PhotoCard photo={featured[3]} onSelect={setSelected} fill label="04" />
              </div>
            </>
          ) : (
            [0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="aspect-[3/4] rounded-3xl border-4 border-dashed border-[var(--outline-variant)] flex items-center justify-center"
              >
                <span className="text-xs font-black uppercase tracking-widest opacity-50">
                  {content.home.featuredEmpty}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <WaterfallBand
        photos={photos}
        onSelect={setSelected}
        height="36vh"
        maxPerColumn={3}
        defer
      />

      <section className="px-4 md:px-10 pt-10 md:pt-14 pb-10 w-full max-w-[1080px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
          <Card className="md:row-span-2" innerClassName="!p-8 md:flex md:flex-col">
            <div className="text-[11px] font-expressive font-black uppercase tracking-widest opacity-60">
              {content.home.aboutPreview.label}
            </div>
            <p className="font-medium text-lg leading-relaxed mt-4 max-w-[640px] opacity-90">
              {content.home.aboutPreview.body}
            </p>
            <button
              type="button"
              className="m3-button-outlined !px-5 !py-2.5 mt-6 md:mt-auto text-sm"
              onClick={() => navigate("/about")}
            >
              {content.home.aboutPreview.cta}
              <ArrowRight size={16} />
            </button>
          </Card>
          <Card innerClassName="!p-8 flex flex-col justify-center">
            <div className="font-expressive-bold text-7xl leading-none tracking-tighter">
              {photos.length}
            </div>
            <div className="text-[11px] font-expressive font-black uppercase tracking-widest opacity-60 mt-2">
              {content.photos.countSuffix}
            </div>
            <button
              type="button"
              className="m3-button-tonal !px-5 !py-2.5 mt-5 self-start text-sm"
              onClick={() => navigate("/photos")}
            >
              {content.home.hero.primaryCta}
              <ArrowRight size={16} />
            </button>
          </Card>
          <Card innerClassName="!p-8 flex flex-col justify-center">
            <DiscordIcon className="w-10 h-10 mb-3" />
            <div className="font-expressive-bold text-2xl uppercase tracking-tight">
              {content.contact.handle}
            </div>
            <div className="text-sm font-medium opacity-60 mt-1 max-w-[280px]">
              {content.contact.description}
            </div>
            <button
              type="button"
              className="m3-button-filled !px-5 !py-2.5 mt-5 self-start text-sm"
              onClick={() => navigate("/contact")}
            >
              {content.contact.title}
              <ArrowRight size={16} />
            </button>
          </Card>
        </div>
      </section>

      <PhotoModal photo={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
