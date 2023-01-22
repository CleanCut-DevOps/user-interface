import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { User } from "~/models";
import { convertResponseToUser } from "../models/User";

type Unauthorized = { type: string; message: string };

type SchrodingersUser = User | null;

type UserContextData = {
    isLoading: boolean;
    user: SchrodingersUser;
    setUser: Dispatch<SetStateAction<SchrodingersUser>>;
};

export const UserContext = createContext<UserContextData>({
    isLoading: true,
    user: null,
    setUser: () => {}
});

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<SchrodingersUser>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [cookies, , removeCookie] = useCookies(["AccessToken"]);

    useEffect(() => {
        if (cookies.AccessToken) {
            axios
                .get(`${import.meta.env.VITE_ACCOUNT_API}/account`, {
                    headers: { Authorization: `Bearer ${cookies.AccessToken}` }
                })
                .then(({ data }) => {
                    const account = convertResponseToUser(data);

                    setUser(account);

                    setIsLoading(false);
                })
                .catch(({ response }) => {
                    const { type, message }: Unauthorized = response.data;

                    setUser(null);

                    removeCookie("AccessToken", {
                        secure: true,
                        sameSite: "strict"
                    });

                    showNotification({
                        title: `🚩 ${type}`,
                        message,
                        color: "red"
                    });

                    setIsLoading(false);
                });
        } else {
            setUser(null);

            setIsLoading(false);
        }
    }, [cookies, setIsLoading]);

    return <UserContext.Provider value={{ isLoading, user, setUser }}>{children}</UserContext.Provider>;
};
