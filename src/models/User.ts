export type User = {
    id: string;
    email: string;
    phone_number: string;
    full_name: string;
    avatar: string | null;
    type: "user" | "cleaner" | "admin";
    created_at: Date;
    updated_at: Date;
};

export const convertResponseToUser = (data: any): User | null => {
    if (
        typeof data.account.id == "string" &&
        typeof data.account.email == "string" &&
        typeof data.account.phone_number == "string" &&
        typeof data.account.full_name == "string" &&
        typeof data.account.type == "string" &&
        typeof data.account.created_at == "number" &&
        typeof data.account.updated_at == "number"
    ) {
        return {
            id: data.account.id as string,
            email: data.account.email as string,
            full_name: data.account.full_name as string,
            phone_number: data.account.phone_number as string,
            avatar: (data.account.avatar ?? null) as string | null,
            type: data.account.type as "user" | "cleaner" | "admin",
            created_at: new Date(data.account.created_at),
            updated_at: new Date(data.account.updated_at)
        };
    }

    return null;
};
