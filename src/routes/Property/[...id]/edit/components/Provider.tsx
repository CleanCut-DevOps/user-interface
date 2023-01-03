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
import { Loading } from "../../../../../components";
import { Property } from "../../../../../models";

type SchrodingersProperty = Property | null;

type PropertyResponse = {
    type: string;
    message: string;
    property: Property;
};

type EditPropertyContextData = {
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
    property: SchrodingersProperty;
    updateProperty: Dispatch<SetStateAction<SchrodingersProperty>>;
};

export const EditPropertyContext = createContext<EditPropertyContextData>({
    step: 0,
    setStep: () => {},
    property: null,
    updateProperty: () => {}
});

interface ComponentProps extends PropsWithChildren {
    id: string;
}

export const EditPropertyProvider: FC<ComponentProps> = ({ id, children }) => {
    const [step, setStep] = useState<number>(0);
    const [property, setProperty] = useState<SchrodingersProperty>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [cookies] = useCookies(["AccessToken"]);

    useEffect(() => {
        if (cookies.AccessToken) {
            axios
                .get(
                    `${import.meta.env.VITE_PROPERTY_API}/api/property/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${cookies.AccessToken}`
                        }
                    }
                )
                .then(({ data }: { data: PropertyResponse }) => {
                    const { property } = data;

                    setProperty(property);

                    setLoading(false);
                })
                .catch(({ response: { data } }) => {
                    showNotification({
                        title: data.type,
                        message: data.message,
                        color: "red"
                    });

                    setLoading(false);
                });
        } else {
            setProperty(null);
            setLoading(false);
        }
    }, [cookies, setLoading, setProperty, showNotification]);

    const updateProperty = () => {};

    return (
        <EditPropertyContext.Provider
            value={{ step, setStep, property, updateProperty }}
        >
            {isLoading ? <Loading /> : children}
        </EditPropertyContext.Provider>
    );
};
