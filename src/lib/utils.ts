export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function groupFansubsBySeason(
  entries: import("./types").Entry[],
  fansubMap: Map<string, string>
): Map<number, string> {
  const seasonsMap = new Map<number, string[][]>();

  entries.forEach((entry) => {
    const season = entry.season;
    const fansubsNames = entry.fansub.map(
      (id) => fansubMap.get(id) ?? "Desconocido"
    );
    if (!seasonsMap.has(season)) {
      seasonsMap.set(season, []);
    }
    seasonsMap.get(season)?.push(fansubsNames);
  });

  const result = new Map<number, string>();
  seasonsMap.forEach((groups, season) => {
    const seasonStr = groups
      .map((g) => (g.length > 1 ? `(${g.join(", ")})` : g.join(", ")))
      .join(" | ");
    result.set(season, seasonStr);
  });
  return result;
}

export function getAnimeType(
  animeId: string,
  entries: import("./types").Entry[]
): "movie" | "anime" | "ova" {
  const entriesForAnime = entries.filter((e) => e.anime === animeId);

  if (entriesForAnime.some((e) => e.type === "movie")) return "movie";
  if (entriesForAnime.some((e) => e.type === "ova")) return "ova";
  return "anime";
}
