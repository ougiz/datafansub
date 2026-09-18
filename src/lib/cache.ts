import { createHash } from "node:crypto";
import { join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

export const cacheDir = join(process.cwd(), ".datafansub-cache");
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
function cachePath(key: string): string {
  const hash = createHash("md5").update(key).digest("hex");
  return join(cacheDir, hash + ".json");
  }

export function cacheGet<T>(key: string): T | undefined {
  try {
    const { savedAt, value } = JSON.parse(readFileSync(cachePath(key), "utf8"));
    if (Date.now() - savedAt < TTL_MS) return value as T;
  } catch {}
  return undefined;
}

export function cacheSet(key: string, value: unknown): void {
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cachePath(key), JSON.stringify({ savedAt: Date.now(), value }));
}
