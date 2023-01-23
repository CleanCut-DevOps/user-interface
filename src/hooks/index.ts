import axios from "axios";
import useSWR from "swr";
import { convertResponseToProperty } from "~/models";

export const fetcher = (url: string) => axios.get(url).then(({ data }) => data);

export const fetchWithToken = (url: string, token?: string) =>
    axios.get(url, { headers: { Authorization: `bearer ${token}` } }).then(({ data }) => data);

export const useProperties = (accessToken?: string) => {
    const { data, error, isLoading } = useSWR(
        [`${import.meta.env.VITE_PROPERTY_API}/property`, accessToken],
        ([url, token]) => fetchWithToken(url, token)
    );

    return {
        data: data,
        isLoading,
        isError: error
    };
};
