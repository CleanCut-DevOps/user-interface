import { RoomType } from "./Room";

export type PropertyType = {
    id: string;
    label: string;
    available: boolean;
    description: string;
    rooms?: RoomType[];
    created_at: Date;
    updated_at: Date;
};
