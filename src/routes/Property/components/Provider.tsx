import axios from "axios";
import { createContext, FC, PropsWithChildren, useEffect, useReducer, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { convertResponseToProperty, Property } from "../../../models";

type ReducerAction =
    | { type: "load"; payload: any[] }
    | { type: "direction"; payload: boolean }
    | { type: "view"; payload: "grid" | "list" }
    | { type: "sort"; payload: "alphabetical" | "created" | "updated" };

type ReducerState = {
    direction: boolean;
    view: "grid" | "list";
    properties: Property[];
    sort: "alphabetical" | "created" | "updated";
};

const initState: ReducerState = {
    view: "grid",
    properties: [],
    direction: true,
    sort: "alphabetical"
};

type PropertyCollectionContextData = {
    isLoading: boolean;
    isSuccess: boolean;
    refetch: () => void;
    direction: boolean;
    view: "grid" | "list";
    properties: Property[];
    sort: "alphabetical" | "created" | "updated";
    dispatch: (action: any) => void;
};

export const PropertyCollectionContext = createContext<PropertyCollectionContextData>({
    view: "grid",
    properties: [],
    isLoading: true,
    direction: true,
    isSuccess: false,
    refetch: () => {},
    dispatch: () => {},
    sort: "alphabetical"
});

export const PropertyCollectionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [cookie] = useCookies(["AccessToken"]);
    const [state, dispatch] = useReducer(reducer, initState);
    const { data, isLoading, isSuccess, refetch } = useQuery("property-list", fetchPropertyList(cookie.AccessToken));

    useEffect(() => {
        if (data != undefined && data.length > 0) {
            dispatch({ type: "load", payload: data });
        } else {
            dispatch({ type: "load", payload: [] });
        }
    }, [data]);

    return (
        <PropertyCollectionContext.Provider
            value={{
                refetch,
                isLoading,
                isSuccess,
                sort: state.sort,
                view: state.view,
                dispatch,
                direction: state.direction,
                properties: state.properties
            }}
        >
            {children}
        </PropertyCollectionContext.Provider>
    );
};

const fetchPropertyList = (accessToken: string | undefined) => async () => {
    if (accessToken === undefined) {
        return [];
    } else {
        const propertyList = await axios
            .get(`${import.meta.env.VITE_PROPERTY_API}/property`, {
                headers: { authorization: `Bearer ${accessToken}` }
            })
            .then(({ data }) => data.properties);

        return propertyList;
    }
};

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
    switch (action.type) {
        case "load":
            let sData = [...action.payload]
                .sort((a, b) => {
                    switch (state.sort) {
                        case "alphabetical":
                            return state.direction ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label);
                        case "created":
                            return state.direction ? a.created_at - b.created_at : b.created_at - a.created_at;
                        case "updated":
                            return state.direction ? a.updated_at - b.updated_at : b.updated_at - a.updated_at;
                        default:
                            return 0;
                    }
                })
                .map(property => convertResponseToProperty(property));

            return { ...state, properties: sData };
        case "direction":
            return { ...state, direction: action.payload };
        case "view":
            return { ...state, view: action.payload };
        case "sort":
            return { ...state, sort: action.payload };
        default:
            return state;
    }
};
