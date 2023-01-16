import { FC, useContext } from "react";
import { Property } from "../../../../models";
import { PropertyCollectionContext } from "../Provider";

export const ListProperties: FC = () => {
    const { properties, isLoading } = useContext(PropertyCollectionContext);

    if (isLoading) return <>Loading List view</>;

    return <>Listing in list view</>;
};
