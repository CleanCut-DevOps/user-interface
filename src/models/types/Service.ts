export type ServiceType = {
    id: string;
    label: string;
    price: number;
    quantifiable: boolean;
    available: boolean;
    created_at: Date;
    updated_at: Date;
    category: string;
    products: Product[];
};

export type Product = {
    label: string;
    quantity: number;
};
