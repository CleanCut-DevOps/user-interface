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
import {
    SuccessfulAccountResponse,
    UnauthorizedResponse,
    User
} from "../models";

interface ResponseData {
    data: SuccessfulAccountResponse;
}

interface UnauthorizedResponseData {
    response: {
        data: UnauthorizedResponse;
    };
}

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
                .then(({ data: { account } }: ResponseData) => {
                    setUser({
                        id: account.id as string,
                        email: account.email as string,
                        username: account.username as string,
                        contact: account.contact as string,
                        avatar: account.avatar as string,
                        type: account.type as "user" | "cleaner" | "admin",
                        created_at: new Date(account.created_at),
                        updated_at: new Date(account.updated_at)
                    });

                    setIsLoading(false);
                })
                .catch(({ response }: UnauthorizedResponseData) => {
                    const { type, message } = response.data;

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
