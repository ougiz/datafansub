import type { Anime, AnimeInfo } from "./types";
import { chunkArray } from "./utils";
import { cacheGet, cacheSet } from "./cache"


const ANILIST_QUERY = `
  query ($ids: [Int]) {
    Page(perPage: 50) {
      media(id_in: $ids, type: ANIME) {
        id
        coverImage {
          large
          medium
        }
        startDate {
          year
        }
        title {
          romaji
          english
          native
        }
      }
    }
  }
`;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function queryChunk(ids: number[]): Promise < any[] > {
  const body = JSON.stringify({ query: ANILIST_QUERY, variables: { ids } });

  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) await sleep(Math.min(1000 * 2 ** attempt, 10_000));
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data?.data?.Page?.media)
        ? data.data.Page.media
        : [];
    }
    const retryAfter = Number(res.headers.get("retry-after"));
    if (retryAfter > 0) await sleep(retryAfter * 1000);
  }
return [];
}

export async function fetchAnimeInfoFromAnilist(
  animes: Anime[]
): Promise<Map<string, AnimeInfo>> {
  const anilistIds = Array.from(
    new Set(animes.map((a) => parseInt(a.anilist_id)))
  );
  if (anilistIds.length === 0) return new Map();

  const cacheKey = "anilist:" + [...anilistIds].sort((a, b) => a - b).join(",");

  let media = cacheGet<any[]>(cacheKey);
  if (!media) {
    const chunks: any[] = [];
    for (const chunk of chunkArray(anilistIds, 50)) {
      chunks.push(...(await queryChunk(chunk)));
    }
    media = chunks;

    if (media.length > 0) {
      cacheSet(cacheKey, media);
      cacheSet(
        "anilist:coverIndex",
        Object.fromEntries(media.map((m) => [m.id, m.coverImage?.large || m.coverImage?.medium]))
      );
    }
  }

  return new Map(
    media.map((m) => [
      m.id.toString(),
      {
        cover: `/poster/${m.id}`,
        year: m.startDate?.year ?? "–",
      },
    ])
  );
}
