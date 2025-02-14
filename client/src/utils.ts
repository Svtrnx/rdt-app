import { DEFAULT_IMAGE } from "./constans";

export const extractImageUrl = (url: string | undefined): string => {
    if (!url) {
        return DEFAULT_IMAGE;
    }
    return url.match(/.*?\.(png|jpg)/)?.[0] || url;
  };
  