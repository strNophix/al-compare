import { writable, derived } from "svelte/store";
import type { ProgressRow, ProgressTable, RowId } from "../lib/types";

export const term = writable("");

export const items = writable<ProgressTable>(new Map());

function search([term, items]): ProgressTable {
  return new Map(
    [...items].filter(([_, value]: [RowId, ProgressRow]) => {
      let title = value.media.title;
      return (
        title.english?.toLowerCase().includes(term) ||
        title.romaji?.toLowerCase().includes(term)
      );
    })
  );
}

export const filtered = derived([term, items], search);
