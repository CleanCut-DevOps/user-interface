export type User = {
    id: string;
    email: string;
    contact: string;
    username: string;
    avatar: string | null;
    type: "user" | "cleaner" | "admin";
    created_at: Date;
    updated_at: Date;
};
