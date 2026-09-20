import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const GITHUB_USER = 'deneyy';
const API_URL = `https://api.github.com/users/${GITHUB_USER}`;
const FALLBACK_URL = `https://github.com/${GITHUB_USER}.png`;
const PUBLIC_DIR = path.resolve('public');
const PFP_OUT = path.join(PUBLIC_DIR, 'pfp.webp');
const FAVICON_OUT = path.join(PUBLIC_DIR, 'favicon.png');
const PFP_SIZE = 256;
const FAVICON_SIZE = 128;
const WEBP_QUALITY = 75;
const PNG_QUALITY = 80;

async function resolveAvatarUrl() {
  try {
    const res = await fetch(API_URL, {
      headers: { 'User-Agent': 'deney-website-build', Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return FALLBACK_URL;
    const data = await res.json();
    if (typeof data?.avatar_url === 'string' && data.avatar_url) return data.avatar_url;
    return FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

const avatarUrl = await resolveAvatarUrl();

let input;
try {
  const res = await fetch(avatarUrl, { headers: { 'User-Agent': 'deney-website-build' } });
  if (!res.ok) throw new Error(`avatar request failed with ${res.status}`);
  input = Buffer.from(await res.arrayBuffer());
} catch (error) {
  if ((await exists(PFP_OUT)) && (await exists(FAVICON_OUT))) {
    console.warn(`avatar fetch failed, keeping existing files: ${error.message}`);
    process.exit(0);
  }
  throw error;
}

await mkdir(PUBLIC_DIR, { recursive: true });

await sharp(input)
  .rotate()
  .resize(PFP_SIZE, PFP_SIZE, { fit: 'cover', position: 'center' })
  .webp({ quality: WEBP_QUALITY })
  .toFile(PFP_OUT);

await sharp(input)
  .rotate()
  .resize(FAVICON_SIZE, FAVICON_SIZE, { fit: 'cover', position: 'center' })
  .png({ quality: PNG_QUALITY })
  .toFile(FAVICON_OUT);

console.log(`avatar: ${avatarUrl} -> public/pfp.webp (${PFP_SIZE}px) + public/favicon.png (${FAVICON_SIZE}px)`);
