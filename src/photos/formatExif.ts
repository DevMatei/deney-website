export function formatAperture(value: number | undefined): string | undefined {
  if (value == null) return undefined;
  return `f/${Math.round(value * 10) / 10}`;
}

export function formatShutter(value: number | undefined): string | undefined {
  if (value == null) return undefined;
  if (value < 1) return `1/${Math.round(1 / value)}s`;
  return `${value}s`;
}

export function formatFocalLength(value: number | undefined): string | undefined {
  if (value == null) return undefined;
  return `${Math.round(value)}mm`;
}

export function formatTakenAt(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
