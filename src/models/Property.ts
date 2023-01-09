export type Property = {
    id: string;
    user_id: string | null;
    icon: string;
    label: string;
    description: string | null;
    images: string[];
    address: Address;
    type: PropertyType | null;
    rooms: Room[];
    created_at: Date;
    updated_at: Date;
};

type Address = {
    line_1: string | null;
    line_2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    updated_at: Date;
};

type PropertyType = {
    id: string;
    label: string;
    description: string;
    detailed_description: string;
    available: boolean;
    created_at: Date;
    updated_at: Date;
};

type Room = {
    type: RoomType;
    quantity: number;
    updated_at: Date;
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
    address: {
        line_1: response.address.line_1 as string | null,
        line_2: response.address.line_2 as string | null,
        city: response.address.city as string | null,
        state: response.address.state as string | null,
        zip: response.address.zip as string | null,
        updated_at: new Date(response.address.updated_at)
    },
    type: response.type
        ? {
              id: response.type.id,
              label: response.type.label,
              available: response.type.available,
              description: response.type.description,
              detailed_description: response.type.detailed_description,
              created_at: new Date(response.type.created_at),
              updated_at: new Date(response.type.updated_at)
          }
        : null,
    rooms: response.rooms.map(
        (r: any): Room => ({
            type: {
                id: r.type.id,
                label: r.type.label,
                price: r.type.price,
                available: r.type.available
            },
            quantity: r.quantity,
            updated_at: new Date(r.updated_at)
        })
    ),
    created_at: new Date(response.created_at),
    updated_at: new Date(response.updated_at)
});
