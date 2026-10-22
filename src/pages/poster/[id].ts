import { join } from "node:path";
import { cacheDir, cacheGet, cacheGetStale } from "../../lib/cache";
import type { APIRoute } from "astro";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

export const prerender = false;

const posterDir = join(cacheDir, "posters");

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  const index =
    cacheGet<Record<string, string>>("anilist:coverIndex") ??
    cacheGetStale<Record<string, string>>("anilist:coverIndex");
  const url = index?.[id];

  if (!id || !url) return new Response("not found", { status: 404 });

  const file = join(posterDir, `${id}.jpg`);

  if (!existsSync(file)) {
    let res: Response;
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    } catch {
      return new Response("upstream timeout", { status: 504 });
    }
    if (!res.ok) return new Response("upstream error", { status: 502 });
    mkdirSync(posterDir, { recursive: true });
    writeFileSync(file, new Uint8Array(await res.arrayBuffer()));
  }

  return new Response(readFileSync(file), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=604800", // 7 days cache
    }
  });
};
