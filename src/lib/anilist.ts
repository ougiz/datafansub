import type { Anime, AnimeInfo } from "./types";
import { chunkArray } from "./utils";

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

export async function fetchAnimeInfoFromAnilist(
  animes: Anime[]
): Promise<Map<string, AnimeInfo>> {
  const anilistIds = Array.from(
    new Set(animes.map((a) => parseInt(a.anilist_id)))
  );

  let aniListMedia: any[] = [];
  for (const chunk of chunkArray(anilistIds, 50)) {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: { ids: chunk },
      }),
    });
    const data = await res.json();
    aniListMedia = aniListMedia.concat(data.data.Page.media);
  }

  return new Map(
    aniListMedia.map((m) => [
      m.id.toString(),
      {
        cover: m.coverImage.large || m.coverImage.medium,
        year: m.startDate?.year ?? "–",
      },
    ])
  );
}
