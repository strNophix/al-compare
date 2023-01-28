<script lang="ts">
  import type { Media } from "../../types";
  import { formatTimestamp } from "../../utils/formatting";

  export let media: Media;
</script>

<a href="{media.siteUrl}" target="_blank" rel="noreferrer">
  <div class="flex flex-row items-center space-x-2">
    <img src="{media.coverImage.medium}" alt="cover" class="h-20 rounded-sm" />
    <div>
      <p class="text-ellipsis">
        {media.title.english ?? media.title.romaji}
      </p>
      <p>Status: {media.status}</p>
      {#if media.nextAiringEpisode}
        <p>
          Ep. {media.nextAiringEpisode.episode} airs: {formatTimestamp(
            media.nextAiringEpisode.airingAt
          )}
        </p>
      {/if}
    </div>
  </div>
</a>
