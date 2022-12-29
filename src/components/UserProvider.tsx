import { showNotification } from "@mantine/notifications";
import axios from "axios";
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useState
} from "react";
import { useCookies } from "react-cookie";
import { User } from "../models";

type Account = {
    account: {
        id: string;
        email: string;
        username: string;
        contact: string;
        avatar: string;
        type: "user" | "cleaner" | "admin";
        created_at: number;
        updated_at: number;
    };
};
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
    const [cookies, , removeCookie] = useCookies([
        "AccessToken",
        "mantine-color-scheme"
    ]);

    useEffect(() => {
        if (cookies.AccessToken) {
            axios
                .get(`${import.meta.env.VITE_ACCOUNT_API}/api/account`, {
                    headers: { Authorization: `Bearer ${cookies.AccessToken}` }
                })
                .then(({ data }) => {
                    const { account }: Account = data;
                    setUser({
                        id: account.id,
                        email: account.email,
                        username: account.username,
                        contact: account.contact,
                        avatar: account.avatar,
                        type: account.type,
                        created_at: new Date(account.created_at),
                        updated_at: new Date(account.updated_at)
                    });

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

    return (
        <UserContext.Provider value={{ isLoading, user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
