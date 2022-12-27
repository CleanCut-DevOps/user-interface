import axios from "axios";

export const fetchUserProperties = (token?: string) => async () => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_ACCOUNT_API}/api/account/property`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return data;
};
