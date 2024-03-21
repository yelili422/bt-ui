import useSWR from "swr";
import { fetcher } from "../libs/fetch";

function useRss() {
  const { data, error, isLoading } = useSWR<{
    id: number,
    url: string,
    title: string,
    rss_type: string,
  }[]>(`/api/rss`, fetcher);

  return {
    rssList: data,
    isLoading,
    isError: error,
  };
}

export { useRss };
