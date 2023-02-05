import axios from "axios";
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "wouter";

import { convertResponseToUser, User } from "~/models";
import { useUserData } from "../hooks";

type SchrodingersUser = User | null;

type UserContextData = {
    isLoading: boolean;
    user: SchrodingersUser;
    setUser: Dispatch<SetStateAction<SchrodingersUser>>;
};

export const fetchWithToken = (url: string, token?: string) =>
    axios.get(url, { headers: { Authorization: `bearer ${token}` } }).then(({ data }) => data);

export const UserContext = createContext<UserContextData>({
    isLoading: true,
    user: null,
    setUser: () => {}
});

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<SchrodingersUser>(null);
    const [isLoading, setLoading] = useState(true);
    const [, setLocation] = useLocation();
    const [cookies, , removeCookie] = useCookies(["AccessToken"]);
    const { data, isError } = useUserData(cookies.AccessToken);

    useEffect(() => {
        if (cookies.AccessToken) {
            fetchWithToken(`${import.meta.env.VITE_ACCOUNT_API}/user`, cookies.AccessToken)
                .then(data => {
                    setUser(convertResponseToUser(data.user));

                    setLoading(false);
                })
                .catch(({ response: { status } }) => {
                    if (status == 422) setLocation("/verify-email");

                    setUser(null);

                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            if (data) {
                setUser(convertResponseToUser(data.user));
            } else if (isError) {
                if (isError.response.status == 422) {
                    setLocation("/verify-email");
                } else {
                    setUser(null);
                    removeCookie("AccessToken");
                }
            }
        }
    }, [data, isLoading, isError, setUser, removeCookie, setLoading]);

    return <UserContext.Provider value={{ isLoading, user, setUser }}>{children}</UserContext.Provider>;
};
