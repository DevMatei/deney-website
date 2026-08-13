import { useMemo } from 'react';
import photoMetadata from '../data/photoMetadata.json';
import content from '../data/content.json';

export interface PhotoMeta {
  file: string;
  bandFile?: string;
  width: number;
  height: number;
  blur?: string;
  camera?: string;
  lens?: string;
  focalLength?: number;
  aperture?: number;
  shutter?: number;
  iso?: number;
  takenAt?: string;
}

export interface Photo {
  url: string;
  bandUrl: string;
  meta: PhotoMeta | undefined;
  alt: string;
}

const PHOTO_MODULES = import.meta.glob('../assets/generated/**/*.webp', {
  eager: true,
  import: 'default',
});

export function usePhotos(): Photo[] {
  return useMemo(() => {
    const metaByFile = new Map<string, PhotoMeta>();
    const entries = (photoMetadata as { photos?: PhotoMeta[] }).photos ?? [];
    for (const entry of entries) {
      metaByFile.set(entry.file, entry);
    }
    const photos: Photo[] = [];
    for (const path of Object.keys(PHOTO_MODULES)) {
      if (path.endsWith('.band.webp')) continue;
      const marker = '/assets/generated/';
      const markerIndex = path.lastIndexOf(marker);
      const relative =
        markerIndex >= 0
          ? path.slice(markerIndex + marker.length)
          : path.slice(path.lastIndexOf('/') + 1);
      const meta = metaByFile.get(relative);
      const bandPath =
        meta?.bandFile !== undefined
          ? Object.keys(PHOTO_MODULES).find(
              (p) =>
                meta.bandFile !== undefined &&
                (p.endsWith(`/${meta.bandFile}`) || p.endsWith(meta.bandFile)),
            )
          : undefined;
      photos.push({
        url: PHOTO_MODULES[path] as string,
        bandUrl: (bandPath !== undefined ? PHOTO_MODULES[bandPath] : undefined) as string,
        meta,
        alt: content.photoAlt,
      });
    }
    photos.sort((a, b) => (a.meta?.file ?? '').localeCompare(b.meta?.file ?? ''));
    return photos;
  }, []);
}
