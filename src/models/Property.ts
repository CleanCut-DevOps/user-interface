import { Room } from "./Room";

export type Property = {
    id: string;
    label: string;
    available: boolean;
    description: string;
    detailed_description: string;
    rooms: Room[];
    created_at: Date;
    updated_at: Date;
};
