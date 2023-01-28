import type { Media } from "./anilist";

export * from "./anilist";

export type RowId = number;
export type ProgressEntry = Record<string, number>;
export type ProgressRow = { media: Media; progress: ProgressEntry };
export type ProgressTable = Map<RowId, ProgressRow>;
