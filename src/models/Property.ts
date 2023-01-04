export type Property = {
    id: string;
    user_id: string | null;
    icon: string;
    label: string;
    description: string | null;
    images: string[];
    address: Address | null;
    type: PropertyType | null;
    rooms: Room[];
    created_at: Date;
    updated_at: Date;
};

type Address = {
    line_1: string;
    line_2: string | null;
    city: string;
    state: string | null;
    postal_code: string;
};

type PropertyType = {
    id: string;
    label: string;
    description: string;
    detailed_description: string;
    available: boolean;
};

type Room = {
    type: RoomType;
    quantity: number;
};

type RoomType = {
    id: string;
    label: string;
    price: number;
    available: boolean;
};

export const convertResponseToProperty = (response: any): Property => ({
    id: response.id as string,
    user_id: response.user_id as string,
    icon: response.icon as string,
    label: response.label as string,
    description: response.description as string | null,
    images: response.images as string[],
    address: response.address
        ? {
              line_1: response.address.line_1 as string,
              line_2: response.address.line_2 as string,
              city: response.address.city as string,
              state: response.address.state as string,
              postal_code: response.address.postal_code as string
          }
        : null,
    type: response.type
        ? {
              id: response.type.id,
              label: response.type.label,
              available: response.type.available,
              description: response.type.description,
              detailed_description: response.type.detailed_description
          }
        : null,
    rooms: response.rooms.map((room: any) => ({
        type: {
            id: room.type.id,
            label: room.type.label,
            price: room.type.price,
            available: room.type.available
        },
        quantity: room.quantity
    })),
    created_at: new Date(response.created_at),
    updated_at: new Date(response.updated_at)
});
