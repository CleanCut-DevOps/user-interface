import { showNotification } from "@mantine/notifications";
import axios from "axios";
import {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    useEffect,
    useReducer
} from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "wouter";
import { Loading } from "../../../../../components";
import { convertResponseToProperty, Property } from "../../../../../models";

interface ComponentProps extends PropsWithChildren {
    id: string;
}

type SchrodingersProperty = Property | null;

type ReducerAction =
    | { type: "next"; payload?: null }
    | { type: "previous"; payload?: null }
    | { type: "setStep"; payload: number }
    | { type: "load"; payload: Property }
    | { type: "brief"; payload: { label: string; icon: string } }
    | {
          type: "details";
          payload: {
              icon: string;
              label: string;
              images: string[];
              description: string | null;
          };
      }
    | {
          type: "address";
          payload: {
              line_1: string;
              line_2: string | null;
              city: string;
              state: string | null;
              postal_code: string;
          };
      }
    | { type: "type"; payload: { id: string } }
    | {
          type: "rooms";
          payload: {
              id: string;
              quantity: number;
              updated_at: Date;
          };
      };

type ReducerState = {
    step: number;
    loading: boolean;
    property: SchrodingersProperty;
};

const initState: ReducerState = {
    step: 0,
    loading: true,
    property: null
};

const reducer = (state: ReducerState, action: ReducerAction) => {
    const { type } = action;

    switch (type) {
        case "next":
            return { ...state, step: state.step + 1 };
        case "previous":
            return { ...state, step: state.step - 1 };
        case "setStep":
            const newStep = action.payload;
            return { ...state, step: newStep };
        case "load":
            const loadPayload = action.payload;
            return { step: 0, loading: false, property: loadPayload };
        case "brief":
            const briefPayload = action.payload;
            return {
                ...state,
                property: state.property
                    ? { ...state.property, ...briefPayload }
                    : null
            };
        case "details":
            const detailsPayload = action.payload;
            return {
                ...state,
                property: state.property
                    ? { ...state.property, ...detailsPayload }
                    : null
            };
        case "address":
            const addressPayload = action.payload;
            return {
                ...state,
                property: state.property
                    ? { ...state.property, ...addressPayload }
                    : null
            };
        case "type":
            const typePayload = action.payload;
            return {
                ...state,
                property: state.property
                    ? { ...state.property, ...typePayload }
                    : null
            };
        case "rooms":
            const roomsPayload = action.payload;
            return {
                ...state,
                property: state.property
                    ? { ...state.property, ...roomsPayload }
                    : null
            };
        default:
            return state;
    }
};

type EditPropertyContextData = {
    step: number;
    property: SchrodingersProperty;
    dispatch: Dispatch<ReducerAction>;
};

export const EditPropertyContext = createContext<EditPropertyContextData>({
    step: 0,
    property: null,
    dispatch: () => {}
});

export const EditPropertyProvider: FC<ComponentProps> = ({ id, children }) => {
    const [cookies] = useCookies(["AccessToken"]);
    const [, setLocation] = useLocation();
    const [state, dispatch] = useReducer(reducer, initState);

    console.log(state);

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
                .then(({ data }) => {
                    const property = convertResponseToProperty(data.property);

                    dispatch({ type: "load", payload: property });
                })
                .catch(({ response: { data } }) => {
                    showNotification({
                        title: data.type,
                        message: data.message,
                        color: "red"
                    });

                    setLocation("/");
                });
        } else {
            showNotification({
                title: "No Access Token",
                message: "Please refresh the site and login to continue 🙂",
                color: "red"
            });

            setLocation("/");
        }
    }, []);

    return (
        <EditPropertyContext.Provider
            value={{ step: state.step, property: state.property, dispatch }}
        >
            {state.loading ? <Loading /> : children}
        </EditPropertyContext.Provider>
    );
};
