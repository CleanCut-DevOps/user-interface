import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useState
} from "react";
import {
    SuccessfulAccountResponse,
    UnauthorizedResponse,
    User
} from "../models";
import { useCookies } from "react-cookie";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

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
    const [cookies] = useCookies(["AccessToken"]);

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
