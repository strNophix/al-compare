import { writable, derived } from "svelte/store";
import type {
  ProgressRow,
  ProgressTable,
  RowId,
  TableFilters,
} from "../lib/types";

export const tableFilters = writable<TableFilters>({
  term: "",
  onlyCommon: false,
});

export const table = writable<ProgressTable>(new Map());

export const tableIndex = writable<string[]>([]);

type SearchParams = [TableFilters, ProgressTable, string[]];

function search([filters, items, index]: SearchParams): ProgressTable {
  return new Map(
    [...items].filter(([_, value]: [RowId, ProgressRow]) => {
      let title = value.media.title;

      if (filters.onlyCommon) {
        if (Object.keys(value.progress).length !== index.length) {
          return false;
        }
      }

      return (
        title.english?.toLowerCase().includes(filters.term) ||
        title.romaji?.toLowerCase().includes(filters.term)
      );
    })
  );
}

export const filtered = derived([tableFilters, table, tableIndex], search);
