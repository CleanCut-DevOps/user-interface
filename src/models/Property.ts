import { PropertyType } from "./types/Property";
import { RoomType } from "./types/Room";

export type Property = {
    id: string;
    user_id: string | null;
    icon: string;
    label: string;
    description: string | null;
    images: string[];
    address: Address;
    type: Omit<PropertyType, "rooms"> | null;
    rooms: Room[];
    created_at: Date;
    updated_at: Date;
    verified_at: Date | null;
    favourite_at: Date | null;
};

type Address = {
    line_1: string | null;
    line_2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    updated_at: Date;
};

export type Room = {
    type: Pick<RoomType, "id" | "label" | "price">;
    quantity: number;
    updated_at: Date;
};

export const convertResponseToProperty = (property: any): Property => ({
    id: property.id,
    user_id: property.user_id,
    icon: property.icon,
    label: property.label,
    description: property.description,
    images: property.images,
    address: {
        line_1: property.address.line_1,
        line_2: property.address.line_2,
        city: property.address.city,
        state: property.address.state,
        zip: property.address.zip,
        updated_at: new Date(property.address.updated_at)
    },
    type: property.type
        ? {
              id: property.type.id,
              label: property.type.label,
              available: property.type.available,
              description: property.type.description,
              created_at: new Date(property.type.created_at),
              updated_at: new Date(property.type.updated_at)
          }
        : null,
    rooms: property.rooms.map(
        (r: any): Room => ({
            type: {
                id: r.type.id,
                label: r.type.label,
                price: r.type.price
            },
            quantity: r.quantity,
            updated_at: new Date(r.updated_at)
        })
    ),
    created_at: new Date(property.created_at),
    updated_at: new Date(property.updated_at),
    verified_at: property.verified_at ? new Date(property.verified_at) : null,
    favourite_at: property.favourite_at ? new Date(property.favourite_at) : null
});
