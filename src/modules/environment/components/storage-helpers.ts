import { env } from "@/env";

const localStorageEnvKey = "saleorApiUrl";

export const resolveEnvUrl = () => {
  try {
    return (
      localStorage.getItem(localStorageEnvKey) ??
      env.NEXT_PUBLIC_INITIAL_ENV_URL
    );
  } catch (e) {
    return env.NEXT_PUBLIC_INITIAL_ENV_URL;
  }
};

export const saveEnvUrlToLocalStorage = (env: string) => {
  try {
    localStorage.setItem(localStorageEnvKey, env);
  } catch (e) {}
};

const localStorageChannelKey = "saleorChannelSlug";

export const resolveChannelSlug = () => {
  try {
    return (
      localStorage.getItem(localStorageChannelKey) ??
      env.NEXT_PUBLIC_INITIAL_CHANNEL_SLUG
    );
  } catch (e) {
    return env.NEXT_PUBLIC_INITIAL_CHANNEL_SLUG;
  }
};

export const saveChannelSlugToLocalStorage = (channelSlug: string) => {
  try {
    localStorage.setItem(localStorageChannelKey, channelSlug);
  } catch (e) {}
};
