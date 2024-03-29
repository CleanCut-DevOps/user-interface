import axios from "axios";
import useSWR from "swr";

export const fetcher = (url: string) => axios.get(url).then(({ data }) => data);

export const fetchWithToken = (url: string, token?: string) =>
    axios.get(url, { headers: { Authorization: `bearer ${token}` } }).then(({ data }) => data);

export const useProperties = (accessToken?: string) => {
    const { data, error, isLoading } = useSWR(
        [`${import.meta.env.VITE_PROPERTY_API}/property`, accessToken],
        ([url, token]) => fetchWithToken(url, token),
        { refreshInterval: 2000 }
    );

    return {
        data: data,
        isLoading,
        isError: error
    };
};

export const useProperty = (id: string, accessToken?: string) => {
    const { data, error, isLoading } = useSWR(
        [`${import.meta.env.VITE_PROPERTY_API}/${id}`, accessToken],
        ([url, token]) => fetchWithToken(url, token)
    );

    return {
        data: data,
        isLoading,
        isError: error
    };
};

export const useBookings = (accessToken?: string) => {
    const { data, error, isLoading } = useSWR(
        [`${import.meta.env.VITE_BOOKING_API}/bookings`, accessToken],
        ([url, token]) => fetchWithToken(url, token),
        { refreshInterval: 2000 }
    );

    return {
        data: data,
        isLoading,
        isError: error
    };
};

export const useBooking = (id: string, accessToken?: string) => {
    const { data, error, isLoading } = useSWR(
        [`${import.meta.env.VITE_BOOKING_API}/bookings/${id}`, accessToken],
        ([url, token]) => fetchWithToken(url, token)
    );

    return {
        data: data,
        isLoading,
        isError: error
    };
};

export const useBookingServices = (accessToken?: string) => {
    const { data, error, isLoading } = useSWR(
        [`${import.meta.env.VITE_BOOKING_API}/types`, accessToken],
        ([url, token]) => fetchWithToken(url, token),
        { refreshInterval: 2000 }
    );

    return {
        data: data,
        isLoading,
        isError: error
    };
};

export const useUserData = (accessToken?: string) => {
    const { data, error, isLoading } = useSWR(
        [`${import.meta.env.VITE_ACCOUNT_API}/user`, accessToken],
        ([url, token]) => fetchWithToken(url, token)
    );

    return {
        data: data,
        isLoading,
        isError: error
    };
};
