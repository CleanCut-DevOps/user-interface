import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

import axios from "axios";
import { createContext, Dispatch, FC, PropsWithChildren, useEffect, useReducer } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "wouter";

import { Loading } from "~/components";
import { convertResponseToProperty, Property } from "~/models";

interface ComponentProps extends PropsWithChildren {
    id: string;
}

type SchrodingersProperty = Property | null;

type ReducerAction =
    | { type: "next" }
    | { type: "previous" }
    | { type: "load"; payload: Property }
    | { type: "setStep"; payload: number }
    | { type: "setSave"; payload: boolean }
    | { type: "addImage"; payload: string }
    | { type: "removeImage"; payload: string }
    | { type: "details"; payload: { icon?: string; label?: string; images?: string[]; description?: string | null } }
    | {
          type: "address";
          payload: {
              line_1?: string | null;
              line_2?: string | null;
              city?: string | null;
              state?: string | null;
              zip?: string | null;
          };
      }
    | {
          type: "type";
          payload: {
              type?: {
                  id: string;
                  label: string;
                  description: string;
                  detailed_description: string;
                  available: boolean;
                  created_at: Date;
                  updated_at: Date;
              };
              rooms?: {
                  quantity: number;
                  updated_at: Date;
                  type: {
                      id: string;
                      type_id: string;
                      label: string;
                      price: number;
                      available: boolean;
                      created_at: Date;
                      updated_at: Date;
                  };
              }[];
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
            if (state.step > 1) return state;
            return { ...state, step: state.step + 1 };

        case "previous":
            if (state.step < 1) return state;
            return { ...state, step: state.step - 1 };

        case "setStep":
            return { ...state, step: action.payload };

        case "setSave":
            return { ...state, saving: action.payload };

        case "load":
            const loadPayload = action.payload;

            return {
                ...state,
                loading: false,
                property: loadPayload
            };

        case "addImage":
            const imagesPayload = action.payload;

            return {
                ...state,
                property: state.property
                    ? { ...state.property, images: [...state.property.images, imagesPayload] }
                    : null
            };

        case "removeImage":
            const imageURL = action.payload;

            return {
                ...state,
                property: state.property
                    ? { ...state.property, images: state.property.images.filter(url => url != imageURL) }
                    : null
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
                property: state.property
                    ? { ...state.property, address: { ...state.property.address, ...addressPayload } }
                    : null
            };

        case "type":
            return {
                ...state,
                property: state.property
                    ? {
                          ...state.property,
                          type: action.payload.type ? action.payload.type : state.property.type,
                          rooms: action.payload.rooms ? action.payload.rooms : state.property.rooms
                      }
                    : null
            };

        default:
            return state;
    }
};

type EditPropertyContextData = {
    step: number;
    forceSave: () => void;
    property: SchrodingersProperty;
    debounced: SchrodingersProperty;
    dispatch: Dispatch<ReducerAction>;
};

export const EditPropertyContext = createContext<EditPropertyContextData>({
    step: 0,
    property: null,
    debounced: null,
    dispatch: () => {},
    forceSave: () => {}
});

export const EditPropertyProvider: FC<ComponentProps> = ({ id, children }) => {
    const [cookies] = useCookies(["AccessToken"]);
    const [, setLocation] = useLocation();
    const [state, dispatch] = useReducer(reducer, initState);

    const [propertyDebounced] = useDebouncedValue(state.property, 1500);

    useEffect(() => {
        if (cookies.AccessToken) {
            axios
                .get(`${import.meta.env.VITE_PROPERTY_API}/property/${id}`, {
                    headers: { Authorization: `Bearer ${cookies.AccessToken}` }
                })
                .then(({ data }) => {
                    const property = convertResponseToProperty(data.property);

                    dispatch({ type: "load", payload: property });
                })
                .catch(({ response: { data } }) => {
                    showNotification({ color: "red", title: data.type, message: data.message });

                    setLocation("/");
                });
        } else {
            showNotification({
                color: "red",
                title: "No Access Token",
                message: "Please login to continue 🙂"
            });

            setLocation("/login");
        }
    }, []);

    useEffect(() => {
        if (state.saving) updateProperty();
    }, [propertyDebounced]);

    const updateProperty = () => {
        if (cookies.AccessToken) {
            axios
                .put(`${import.meta.env.VITE_PROPERTY_API}/property/${id}`, propertyDebounced, {
                    headers: { Authorization: `Bearer ${cookies.AccessToken}` }
                })
                .then(({ data }) => {
                    dispatch({ type: "setSave", payload: false });

                    showNotification({
                        title: data.type,
                        message: data.message,
                        color: "green"
                    });
                })
                .catch(({ response: { data } }) => {
                    dispatch({ type: "setSave", payload: false });

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
                property: state.property,
                forceSave: updateProperty,
                debounced: propertyDebounced
            }}
        >
            {state.loading ? <Loading /> : children}
        </EditPropertyContext.Provider>
    );
};
