import type { Fansub, Anime, Entry } from "./types";
import { fetchAnimeInfoFromAnilist } from "./anilist";
import { groupFansubsBySeason, getAnimeType } from "./utils";

const API_URL = import.meta.env.PUBLIC_API_URL;

export async function fetchData() {
  const [fansubsRes, animesRes, entriesRes] = await Promise.all([
    fetch(`${API_URL}/api/collections/fansubs/records`),
    fetch(`${API_URL}/api/collections/animes/records`),
    fetch(`${API_URL}/api/collections/entries/records`),
  ]);

  const fansubsData = await fansubsRes.json();
  const animesData = await animesRes.json();
  const entriesData = await entriesRes.json();

  const fansubs: Fansub[] = fansubsData.items || fansubsData;
  const animes: Anime[] = animesData.items || animesData;
  const entries: Entry[] = entriesData.items || entriesData;

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
