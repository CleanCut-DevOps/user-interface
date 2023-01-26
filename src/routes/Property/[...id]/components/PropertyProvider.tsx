import { createContext, Dispatch, FC, PropsWithChildren, useEffect, useReducer } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "wouter";

import { Loading } from "~/components";
import { useProperty } from "~/hooks";
import { convertResponseToProperty, Property, PropertyType, Room } from "~/models";

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
              type?: PropertyType;
              rooms?: Room[];
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

        case "load":
            return { ...state, loading: false, property: action.payload };

        case "addImage":
            return {
                ...state,
                property: state.property
                    ? { ...state.property, images: [...state.property.images, action.payload] }
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
                property: state.property ? { ...state.property, ...detailsPayload } : null
            };

        case "address":
            const addressPayload = action.payload;

            return {
                ...state,
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
    property: SchrodingersProperty;
    dispatch: Dispatch<ReducerAction>;
};

export const EditPropertyContext = createContext<EditPropertyContextData>({
    step: 0,
    property: null,
    dispatch: () => {}
});

export const EditPropertyProvider: FC<ComponentProps> = ({ id, children }) => {
    const [, setLocation] = useLocation();
    const [cookies] = useCookies(["AccessToken"]);
    const [state, dispatch] = useReducer(reducer, initState);
    const { data, isError } = useProperty(id, cookies.AccessToken);

    useEffect(() => {
        if (isError) setLocation("/");
    }, [isError]);

    useEffect(() => {
        if (data) {
            const property = convertResponseToProperty(data.property);

            console.log(property);

            dispatch({ type: "load", payload: property });
        }
    }, [data]);

    return (
        <EditPropertyContext.Provider
            value={{
                dispatch,
                step: state.step,
                property: state.property
            }}
        >
            {state.loading ? <Loading /> : children}
        </EditPropertyContext.Provider>
    );
};
