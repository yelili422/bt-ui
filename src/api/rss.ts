import useSWR from "swr";
import { fetcher } from "../libs/fetch";
import axios from "axios";

interface RssProps {
  id: number;
  url: string;
  title: string | null;
  season: number | null;
  rss_type: string;
  enabled: boolean;
}

export const useRss = () => {
  const { data, error, isLoading, mutate } = useSWR<RssProps[]>(`/api/rss`, fetcher);

  return {
    rssList: data,
    isLoading,
    isError: error,
    reloadRss: mutate,
  };
};

export const updateRss = async (rss: RssProps) => {
  await axios.put(`/api/rss/${rss.id}`, rss);
};

export type { RssProps };
