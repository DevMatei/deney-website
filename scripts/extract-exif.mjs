import { mkdir, readdir, rm, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import exifr from 'exifr';
import sharp from 'sharp';
import convert from 'heic-convert';

process.env.LIBHEIF_SECURITY_LIMITS = 'off';

const PHOTOS_DIR = path.resolve('src/assets/photos');
const GENERATED_DIR = path.resolve('src/assets/generated');
const OUT_FILE = path.resolve('src/data/photoMetadata.json');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', '.tif', '.tiff']);
const MAX_EDGE = 1200;
const WEBP_QUALITY = 75;
const BAND_EDGE = 640;
const BAND_QUALITY = 70;

async function collectFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)));
    } else if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function extractExif(file) {
  try {
    return await exifr.parse(file, {
      pick: [
        'Make',
        'Model',
        'LensModel',
        'FNumber',
        'ExposureTime',
        'ISOSpeedRatings',
        'ISO',
        'FocalLength',
        'DateTimeOriginal',
        'Orientation',
      ],
      gps: false,
      tiff: true,
      ifd0: true,
      exif: true,
      ifd1: false,
      interop: false,
      iptc: false,
      xmp: false,
      icc: false,
      wholeFile: true,
    });
  } catch {
    return undefined;
  }
}


async function convertHeicToBuffer(file) {
  const inputBuffer = await readFile(file);
  const outputBuffer = await convert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.92,
  });
  return Buffer.from(outputBuffer);
}

function isSecurityLimitError(error) {
  return /security limit/i.test(error?.message ?? '');
}

function toMetadata(relative, exifData, image, blur) {
  const file = relative.replace(/\\/g, '/').replace(/\.[^/.]+$/, '') + '.webp';
  const entry = {
    file,
    width: image.width,
    height: image.height,
    blur,
  };
  const make = typeof exifData?.Make === 'string' ? exifData.Make : undefined;
  const model = typeof exifData?.Model === 'string' ? exifData.Model : undefined;
  const camera = [make, model].filter(Boolean).join(' ').trim();
  if (camera) entry.camera = camera;
  const lens = exifData?.LensModel;
  if (typeof lens === 'string' && lens) entry.lens = lens;
  const focalLength = exifData?.FocalLength;
  if (typeof focalLength === 'number' && Number.isFinite(focalLength)) {
    entry.focalLength = focalLength;
  }
  const aperture = exifData?.FNumber;
  if (typeof aperture === 'number' && Number.isFinite(aperture)) {
    entry.aperture = aperture;
  }
  const shutter = exifData?.ExposureTime;
  if (typeof shutter === 'number' && Number.isFinite(shutter) && shutter > 0) {
    entry.shutter = shutter;
  }
  const iso = exifData?.ISO ?? exifData?.ISOSpeedRatings;
  if (typeof iso === 'number' && Number.isFinite(iso)) {
    entry.iso = iso;
  }
  const takenAt = exifData?.DateTimeOriginal;
  if (takenAt instanceof Date && !Number.isNaN(takenAt.getTime())) {
    entry.takenAt = takenAt.toISOString();
  }
  return entry;
}

await mkdir(PHOTOS_DIR, { recursive: true });
await rm(GENERATED_DIR, { recursive: true, force: true });
await mkdir(GENERATED_DIR, { recursive: true });

const files = await collectFiles(PHOTOS_DIR);
const photos = [];
let skipped = 0;
let convertedFallback = 0;

for (const file of files) {
  const relative = path.relative(PHOTOS_DIR, file);
  const exifData = await extractExif(file);
  const targetName = relative.replace(/\\/g, '/').replace(/\.[^/.]+$/, '') + '.webp';
  const targetPath = path.join(GENERATED_DIR, targetName);
  try {
    await mkdir(path.dirname(targetPath), { recursive: true });

    let sharpInput = file;
    try {
      await sharp(sharpInput).metadata();
    } catch (probeError) {
      if (isSecurityLimitError(probeError)) {
        sharpInput = await convertHeicToBuffer(file);
        convertedFallback += 1;
      } else {
        throw probeError;
      }
    }

    const image = await sharp(sharpInput)
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(targetPath);
    const blurBuffer = await sharp(sharpInput)
      .rotate()
      .resize({ width: 64, height: 64, fit: 'inside' })
      .webp({ quality: 35 })
      .toBuffer();
    const blur = `data:image/webp;base64,${blurBuffer.toString('base64')}`;
    const bandName = targetName.replace(/\.webp$/, '.band.webp');
    await sharp(sharpInput)
      .rotate()
      .resize({ width: BAND_EDGE, height: BAND_EDGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: BAND_QUALITY })
      .toFile(path.join(GENERATED_DIR, bandName));
    photos.push({ ...toMetadata(relative, exifData, image, blur), bandFile: bandName });
  } catch (error) {
    skipped += 1;
    console.warn(`skipped ${relative}: ${error.message}`);
  }
}

photos.sort((a, b) => a.file.localeCompare(b.file));
await writeFile(OUT_FILE, `${JSON.stringify({ photos }, null, 2)}\n`);
console.log(`photos: ${photos.length}, skipped: ${skipped}, motion-photo fallback used: ${convertedFallback}`);
