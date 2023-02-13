export type User = {
    id: string;
    email: string;
    phone: string;
    name: string;
    preferred_contact: "email" | "phone";
    created_at: Date;
    updated_at: Date;
};

export const convertResponseToUser = (user: any): User | null => {
    if (
        typeof user.id == "string" &&
        typeof user.email == "string" &&
        typeof user.phone == "string" &&
        typeof user.name == "string" &&
        typeof user.created_at == "string" &&
        typeof user.updated_at == "string"
    ) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            preferred_contact: user.preferred_contact as "email" | "phone",
            created_at: new Date(user.created_at),
            updated_at: new Date(user.updated_at)
        };
    }

    return null;
};
