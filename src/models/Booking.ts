import { Product, ServiceType } from ".";

export type Booking = {
    id: string;
    start_time: Date;
    end_time: Date;
    secondary_contact: string | null;
    additional_information: string | null;
    cleaner_remarks: string | null;
    rejected_at: Date | null;
    complete_at: Date | null;
    created_at: Date;
    updated_at: Date;
    services: Service[];
};

type Service = {
    quantity: number;
    type: Pick<ServiceType, "id" | "label" | "category" | "products">;
};

export const convertResponseToBooking = (booking: any): Booking => ({
    id: booking.id,
    start_time: new Date(booking.start_time),
    end_time: new Date(booking.end_time),
    secondary_contact: booking.secondary_contact,
    additional_information: booking.additional_information,
    cleaner_remarks: booking.cleaner_remarks,
    rejected_at: booking.rejected_at ? new Date(booking.rejected_at) : null,
    complete_at: booking.complete_at ? new Date(booking.complete_at) : null,
    created_at: new Date(booking.created_at),
    updated_at: new Date(booking.updated_at),
    services: booking.services.map(
        (service: any): Service => ({
            quantity: service.quantity,
            type: {
                id: service.type.id,
                label: service.type.label,
                category: service.type.category,
                products: service.type.products.map(
                    (product: any): Product => ({
                        label: product.label,
                        quantity: product.quantity
                    })
                )
            }
        })
    )
});
