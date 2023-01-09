import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { createContext, Dispatch, FC, PropsWithChildren, useEffect, useReducer } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "wouter";
import { Loading } from "../../../../../components";
import { convertResponseToProperty, Property } from "../../../../../models";

interface ComponentProps extends PropsWithChildren {
    id: string;
}

type SchrodingersProperty = Property | null;

type ReducerAction =
    | { type: "next" }
    | { type: "previous" }
    | { type: "toggleSave" }
    | { type: "load"; payload: Property }
    | { type: "setStep"; payload: number }
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
              zip: string;
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
    saving: boolean;
    loading: boolean;
    property: SchrodingersProperty;
};

const initState: ReducerState = {
    step: 0,
    saving: false,
    loading: true,
    property: null
};

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
    const { type } = action;

    switch (type) {
        case "next":
            return { ...state, step: state.step + 1 };

        case "previous":
            return { ...state, step: state.step - 1 };

        case "setStep":
            const newStep = action.payload;

            return { ...state, step: newStep };

        case "toggleSave":
            return { ...state, saving: !state.saving };

        case "load":
            const loadPayload = action.payload;

            return {
                ...state,
                loading: false,
                saving: false,
                property: loadPayload
            };

        case "brief":
            const briefPayload = action.payload;

            return {
                ...state,
                saving: true,
                property: state.property ? { ...state.property, ...briefPayload } : null
            };

        case "details":
            const detailsPayload = action.payload;

            return {
                ...state,
                saving: true,
                property: state.property ? { ...state.property, ...detailsPayload } : null
            };

        case "address":
            const addressPayload = action.payload;

            return {
                ...state,
                saving: true,
                property: state.property ? { ...state.property, ...addressPayload } : null
            };

        case "type":
            const typePayload = action.payload;

            return {
                ...state,
                saving: true,
                property: state.property ? { ...state.property, ...typePayload } : null
            };

        case "rooms":
            const roomsPayload = action.payload;

            return {
                ...state,
                saving: true,
                property: state.property ? { ...state.property, ...roomsPayload } : null
            };

        default:
            return state;
    }
};

type EditPropertyContextData = {
    step: number;
    saving: boolean;
    forceSave: () => void;
    property: SchrodingersProperty;
    dispatch: Dispatch<ReducerAction>;
};

export const EditPropertyContext = createContext<EditPropertyContextData>({
    step: 0,
    saving: false,
    property: null,
    dispatch: () => {},
    forceSave: () => {}
});

export const EditPropertyProvider: FC<ComponentProps> = ({ id, children }) => {
    const [cookies] = useCookies(["AccessToken"]);
    const [, setLocation] = useLocation();
    const [state, dispatch] = useReducer(reducer, initState);

    useEffect(() => {
        if (cookies.AccessToken) {
            axios
                .get(`${import.meta.env.VITE_PROPERTY_API}/property/${id}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.AccessToken}`
                    }
                })
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

    useEffect(() => {
        if (state.property && state.saving && !state.loading) {
            updateProperty();
        }
    }, [state.property]);

    const updateProperty = () => {
        if (cookies.AccessToken) {
            axios
                .put(`${import.meta.env.VITE_PROPERTY_API}/property/${id}`, state.property, {
                    headers: {
                        Authorization: `Bearer ${cookies.AccessToken}`
                    }
                })
                .then(({ data }) => {
                    const property = convertResponseToProperty(data.property);

                    dispatch({ type: "load", payload: property });
                })
                .catch(({ response: { data } }) => {
                    dispatch({ type: "toggleSave" });

                    showNotification({
                        title: data.type,
                        message: `${data.message}. Please try again after fixing the issue.`,
                        color: "red"
                    });
                });
        } else {
            showNotification({
                title: "No Access Token",
                message: "Please refresh the site and login to continue 🙂",
                color: "red"
            });

            setLocation("/");
        }
    };

    return (
        <EditPropertyContext.Provider
            value={{
                dispatch,
                step: state.step,
                saving: state.saving,
                property: state.property,
                forceSave: updateProperty
            }}
        >
            {state.loading ? <Loading /> : children}
        </EditPropertyContext.Provider>
    );
};
