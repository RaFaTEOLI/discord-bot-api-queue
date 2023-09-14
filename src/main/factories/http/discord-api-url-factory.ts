import 'dotenv/config';

export const makeDiscordApiUrl = (path: string): string => {
  const apiUrl = process.env.DISCORD_API_URL;
  if (path.startsWith('/')) {
    return `${apiUrl}${path}`;
  }
  return `${apiUrl}/${path}`;
};
