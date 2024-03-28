import useSWR from "swr";
import { fetcher, api } from "../libs/fetch";

interface RssProps {
  id: number;
  url: string;
  title: string | null;
  season: number | null;
  rss_type: string;
  enabled: boolean;
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
  await api.put(`/api/rss/${rss.id}`, rss);
};

export const deleteRss = async (id: number) => {
  await api.delete(`/api/rss/${id}`);
};

export const createRss = async (rss: RssProps) => {
  await api.post(`/api/rss`, rss);
};

export type { RssProps };
