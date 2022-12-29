import { createContext, FC, PropsWithChildren, useState } from "react";
import { RoomType, PropertyType } from "../../../../models";

type Rooms = { type: RoomType; quantity: number }[];

type Address = {
    line_1: string;
    line_2: string;
    city: string;
    state: string;
    postal_code: string;
};

type PropertyCreationContextType = {
    propertyType: PropertyType | null;
    rooms: Rooms | null;
    address: Address | null;
    images: string[] | null;
    setPropertyType: React.Dispatch<React.SetStateAction<PropertyType | null>>;
    setRooms: React.Dispatch<React.SetStateAction<Rooms | null>>;
    setAddress: React.Dispatch<React.SetStateAction<Address | null>>;
    setImages: React.Dispatch<React.SetStateAction<string[] | null>>;
};

export const PropertyCreationContext =
    createContext<PropertyCreationContextType>({
        propertyType: null,
        rooms: null,
        address: null,
        images: null,
        setPropertyType: () => {},
        setRooms: () => {},
        setAddress: () => {},
        setImages: () => {}
    });

export const PropertyCreationProvider: FC<PropsWithChildren> = ({
    children
}) => {
    const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
    const [rooms, setRooms] = useState<Rooms | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [images, setImages] = useState<string[] | null>(null);

    return (
        <PropertyCreationContext.Provider
            value={{
                propertyType,
                setPropertyType,
                rooms,
                setRooms,
                address,
                setAddress,
                images,
                setImages
            }}
        >
            {children}
        </PropertyCreationContext.Provider>
    );
};
