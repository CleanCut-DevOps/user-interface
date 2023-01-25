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

export const convertResponseToUser = (account: any): User | null => {
    if (
        typeof account.id == "string" &&
        typeof account.email == "string" &&
        typeof account.phone_number == "string" &&
        typeof account.full_name == "string" &&
        typeof account.type == "string" &&
        typeof account.created_at == "number" &&
        typeof account.updated_at == "number"
    ) {
        return {
            id: account.id as string,
            email: account.email as string,
            full_name: account.full_name as string,
            phone_number: account.phone_number as string,
            avatar: (account.avatar ?? null) as string | null,
            type: account.type as "user" | "cleaner" | "admin",
            created_at: new Date(account.created_at),
            updated_at: new Date(account.updated_at)
        };
    }

    return null;
};
