import axios from "axios";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetcher = async (url: string) =>
  api.get(url).then((res) => res.data);
