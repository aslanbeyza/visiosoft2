
export function seeded(n: number): number {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;

  return Math.round((x - Math.floor(x)) * 1e6) / 1e6;
}

export function pick<T>(arr: readonly T[], n: number): T {
  return arr[Math.floor(seeded(n) * arr.length) % arr.length];
}

export function seededInt(n: number, min: number, max: number): number {
  return min + Math.floor(seeded(n) * (max - min + 1));
}

export function pad(n: number, len = 2): string {
  return String(n).padStart(len, '0');
}
