import axios from "axios";

if (process.env.NODE_ENV === "production") {
  axios.defaults.baseURL = import.meta.env.REACT_APP_API_URL;
}

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetcher = async (url: string) =>
  api.get(url).then((res) => res.data);
