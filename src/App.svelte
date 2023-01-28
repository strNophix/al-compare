<script lang="ts">
  import type { MediaListCollection, ProgressRow, RowId } from "./lib/types";
  import { term, items, filtered } from "./stores/table";
  import RowHeader from "./lib/components/table/RowHeader.svelte";
  import { AniList } from "./lib/services/anilist";
  import { formatProgress } from "./lib/utils/formatting";

  let inputUser = "";
  let progressIndex = [];

  function hotEncode(index, data) {
    return index.map((idx) => data[idx] ?? null);
  }

  function processUser(userName: string, mediaList: MediaListCollection) {
    progressIndex.push(userName);

    for (const list of mediaList.lists) {
      for (const listEntry of list.entries) {
        let rowId = listEntry.media.id;

        let row: ProgressRow = $items.get(rowId) ?? {
          media: listEntry.media,
          progress: {},
        };

        row.progress[userName] = listEntry.progress;

        items.update((map) => map.set(rowId, row));
      }
    }

    progressIndex = progressIndex;
  }

  async function handleAddUser() {
    if (inputUser.length === 0) return;
    const { error, data } = await AniList.fetchMediaList(inputUser);

    const resp = await data.json();
    processUser(inputUser, resp.data.MediaListCollection);

    inputUser = "";
  }

  let searchTerm = "";
  $: term.set(searchTerm.toLowerCase());

  const styleClasses = {
    tableHeader: "text-sm font-medium text-gray-900 px-6 py-4 text-left",
  };
</script>

<main class="w-screen min-h-screen bg-slate-50">
  <div class="container mx-auto">
    <table class="min-w-full">
      <thead>
        <th scope="col" class="{styleClasses.tableHeader} w-1/3">
          <input
            class="border rounded-sm px-3 py-2"
            type="text"
            placeholder="Filter media"
            bind:value="{searchTerm}"
          />
        </th>
        {#each progressIndex as userName}
          <th scope="col" class="{styleClasses.tableHeader}">
            {userName}
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
            {#each hotEncode(progressIndex, progress) as entry}
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
