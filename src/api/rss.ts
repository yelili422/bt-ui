import useSWR from "swr";
import { fetcher, api } from "../libs/fetch";

interface RssProps {
  id: number;
  url: string;
  title: string | null;
  season: number | null;
  rss_type: string;
  enabled: boolean;
  filters: string[] | null;
  description: string | null;
  category: string | null;
}

interface SubscriptionItemProps {
  category: string;
  episode: number;
  episode_title: string;
  fansub: string;
  media_info: string;
  season: number;
  title: string;
  torrent: {
    category: string | null;
    content_len: number;
    pub_date: string;
    save_path: string | null;
    url: string;
  };
  url: string;
}

interface SubscriptionProps {
  items: SubscriptionItemProps[];
  url: string;
}

interface RssPreviewProps {
  paths: string[];
  rss: SubscriptionProps;
}

export const useRss = () => {
  const { data, error, isLoading, mutate } = useSWR<RssProps[]>(
    `/api/rss`,
    fetcher,
    { refreshInterval: 1000 }
  );

  return {
    rssList: data,
    isLoading,
    isError: error,
    reloadRss: mutate,
  };
};

export const updateRss = async (rss: RssProps) => {
  return await api.put(`/api/rss/${rss.id}`, rss);
};

export const deleteRss = async (id: number) => {
  return await api.delete(`/api/rss/${id}`);
};

export const createRss = async (rss: RssProps) => {
  return await api.post(`/api/rss`, rss);
};

export const usePreviewRss = (
  rss: RssProps,
  callback: (data: RssPreviewProps) => void
) => {
  let url = `/api/rss/preview?url=${encodeURIComponent(rss.url)}&rss_type=${
    rss.rss_type
  }`;
  if (rss.title) {
    url += `&title=${encodeURIComponent(rss.title)}`;
  }
  if (rss.season) {
    url += `&season=${rss.season}`;
  }

  const { data, error, isLoading } = useSWR<RssPreviewProps>(
    `/api/rss/preview?url=${encodeURIComponent(url)}&rss_type=${
      rss.rss_type
    }`,
    fetcher,
    {
      onSuccess: (data) => {
        if (callback) {
          callback(data);
        }
      },
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    preview: data,
    isLoading,
    isError: error,
  };
};

export type {
  RssProps,
  RssPreviewProps,
};
