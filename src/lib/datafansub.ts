import type { Fansub, Anime, Entry } from "./types";
import { fetchAnimeInfoFromAnilist } from "./anilist";
import { groupFansubsBySeason, getAnimeType } from "./utils";

const API_URL = import.meta.env.PUBLIC_API_URL;

async function fetchAllPages<T>(baseUrl: string): Promise<T[]> {
  let page = 1;
  let allItems: T[] = [];
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${baseUrl}?page=${page}&perPage=100`);
    const data = await res.json();
    const items = data.items || data;
    allItems = [...allItems, ...items];
    hasMore = data.totalPages > page;
    page++;
  }

  return allItems;
}

export async function fetchData() {
  const [fansubs, animes, entries] = await Promise.all([
    fetchAllPages<Fansub>(`${API_URL}/api/collections/fansubs/records`),
    fetchAllPages<Anime>(`${API_URL}/api/collections/animes/records`),
    fetchAllPages<Entry>(`${API_URL}/api/collections/entries/records`),
  ]);

  const animeInfoMap = await fetchAnimeInfoFromAnilist(animes);
  const fansubMap = new Map(fansubs.map((f) => [f.id, f.name]));

  const getGroupFansubsBySeason = (animeId: string) => {
    const animeEntries = entries.filter((e) => e.anime === animeId);
    return groupFansubsBySeason(animeEntries, fansubMap);
  };

  const getType = (animeId: string) => getAnimeType(animeId, entries);

  return {
    animes,
    animeInfoMap,
    groupFansubsBySeason: getGroupFansubsBySeason,
    getAnimeType: getType,
    entries,
    fansubMap,
    fansubs,
  };
}
