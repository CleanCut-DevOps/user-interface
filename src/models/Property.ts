import { PropertyType } from "./types/Property";
import { RoomType } from "./types/Room";

export type Property = {
    id: string;
    user_id: string | null;
    type: PropertyType | null;
    icon: string;
    label: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    address: Address | null;
    rooms: Room[];
    images: string[];
};

export type Room = {
    type: RoomType;
    label: string;
    quantity: number;
    updated_at: Date;
};

export type Address = {
    line_1: string;
    line_2: string | null;
    city: string;
    state: string | null;
    postal_code: string;
};
