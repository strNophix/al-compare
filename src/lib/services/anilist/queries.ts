export const mediaListQuery = `
  query me($username: String) {
    MediaListCollection(userName: $username, type: ANIME, status:CURRENT) {
      lists {
        entries {
          progress
          media {
            id
            status(version:2)
            coverImage {
              medium
              color
            }
            genres
            siteUrl
            title {
              romaji
              english
            }
            nextAiringEpisode {
              airingAt
              episode
            }
            episodes
          }
        }
      }
    }
  }
`;
