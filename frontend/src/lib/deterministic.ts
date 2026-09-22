/**
 * Deterministik sözde-rastgele üreteç.
 * Sunucu ve istemci aynı değeri üretsin diye Math.random kullanılmaz;
 * böylece hydration uyuşmazlığı oluşmaz.
 */
export function seeded(n: number): number {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  // Math.sin son bitlerde platformdan platforma değişebilir.
  // Sunucu ve istemci aynı değeri üretsin diye sonucu sabit
  // basamağa yuvarlıyoruz — aksi halde hydration uyuşmazlığı olur.
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
