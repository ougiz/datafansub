export interface Fansub {
  id: string;
  name: string;
  website: string;
}

export interface Anime {
  id: string;
  name: string;
  romaji?: string;
  anilist_id: string;
}

export interface Entry {
  id: string;
  anime: string;
  season: number;
  status: string;
  spanish_variant: string;
  fansub: string[];
  nyaa?: string;
  nekobt?: string;
  type: "movie" | "anime" | "ova";
  source: string;
  name?: string;
  created: string;
  updated: string;
}

export interface AnimeInfo {
  cover: string;
  year: number | string;
}
