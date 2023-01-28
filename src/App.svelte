<script lang="ts">
  import type { MediaListCollection, ProgressRow } from "./lib/types";
  import { tableFilters, table, filtered, tableIndex } from "./stores/table";
  import RowHeader from "./lib/components/table/RowHeader.svelte";
  import { AniList } from "./lib/services/anilist";
  import { formatProgress } from "./lib/utils/formatting";
  import { onMount } from "svelte";

  const styleClasses = {
    tableHeader: "text-sm font-medium text-gray-900 px-6 py-4 text-left",
  };

  let searchTerm = "";
  let onlyShowCommon = true;

  let inputUser = "";

  onMount(async () => {
    const urlParams = new URL(window.location.href).searchParams;
    const users = urlParams.getAll("users[]");
    users.forEach(loadUser);
  });

  function hotEncode(index, data) {
    return index.map((idx) => data[idx] ?? null);
  }

  function processUser(username: string, mediaList: MediaListCollection) {
    tableIndex.update((old) => [...old, username]);

    for (const list of mediaList.lists) {
      for (const listEntry of list.entries) {
        let rowId = listEntry.media.id;

        let row: ProgressRow = $table.get(rowId) ?? {
          media: listEntry.media,
          progress: {},
        };

        row.progress[username] = listEntry.progress;

        table.update((map) => map.set(rowId, row));
      }
    }
  }

  async function loadUser(username: string) {
    const { error, data } = await AniList.fetchMediaList(username);
    const resp = await data.json();
    processUser(username, resp.data.MediaListCollection);
  }

  async function handleAddUser() {
    if (inputUser.length === 0) return;
    loadUser(inputUser);
    inputUser = "";
  }

  $: tableFilters.update((old) => ({
    term: searchTerm.toLowerCase(),
    onlyCommon: onlyShowCommon,
  }));
</script>

<main class="w-screen min-h-screen bg-slate-50">
  <div class="container mx-auto">
    <table class="min-w-full">
      <thead>
        <th scope="col" class="{styleClasses.tableHeader} w-1/3">
          <div class="flex items-center space-x-2">
            <input
              class="border rounded-sm px-3 py-2"
              type="text"
              placeholder="Filter media"
              bind:value="{searchTerm}"
            />
            <div>
              <label for="onlyCommon">Only show common media</label>
              <input
                id="onlyCommon"
                type="checkbox"
                bind:checked="{onlyShowCommon}"
              />
            </div>
          </div>
        </th>
        {#each $tableIndex as username}
          <th scope="col" class="{styleClasses.tableHeader}">
            {username}
          </th>
        {/each}
        <th scope="col" class="{styleClasses.tableHeader}">
          <input
            class="border rounded-sm px-3 py-2"
            type="text"
            placeholder="AniList user"
            bind:value="{inputUser}"
          />
          <button class="py-2 px-3 bg-gray-100" on:click="{handleAddUser}">
            Add User
          </button>
        </th>
      </thead>
      <tbody>
        {#each Array.from($filtered.values()) as { media, progress }}
          <tr>
            <td class="px-6 py-3 text-sm font-medium text-gray-900">
              <RowHeader media="{media}" />
            </td>
            {#each hotEncode($tableIndex, progress) as entry}
              <td class="text-sm text-gray-900 font-light px-6 py-4">
                {formatProgress(entry, media.episodes)}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>
