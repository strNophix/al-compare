import { until } from "@open-draft/until";
import { mediaListQuery } from "./queries";

export class AniList {
  static apiUrl = "https://graphql.anilist.co";

  static buildOptions(query, variables) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    };
  }

  static async fetchMediaList(username: string) {
    const options = this.buildOptions(mediaListQuery, { username });
    return await until(() => fetch(this.apiUrl, options));
  }
}
