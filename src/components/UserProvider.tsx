import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useState
} from "react";
import { User } from "../models";
import { useCookies } from "react-cookie";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

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
    const [cookies] = useCookies(["AccessToken"]);

    useEffect(() => {
        if (cookies.AccessToken) {
            axios
                .get(`${import.meta.env.VITE_ACCOUNT_API}/api/account`, {
                    headers: { Authorization: `Bearer ${cookies.AccessToken}` }
                })
                .then(({ data }) => {
                    setUser({
                        id: data.id as string,
                        email: data.email as string,
                        username: data.username as string,
                        contact: data.contact as string,
                        avatar: data.avatar as string,
                        type: data.type as "user" | "cleaner" | "admin",
                        created_at: new Date(data.created_at),
                        updated_at: new Date(data.updated_at)
                    });

                    setIsLoading(false);
                })
                .catch(({ response: { data } }) => {
                    const { type, message } = data;

                    showNotification({
                        title: `🚩 ${type}`,
                        message,
                        color: "red"
                    });

                    setIsLoading(false);
                });
        } else setIsLoading(false);
    }, [cookies, setIsLoading]);

    return (
        <UserContext.Provider value={{ isLoading, user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
