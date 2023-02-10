import { createContext, Dispatch, FC, PropsWithChildren, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbCalendarPlus, TbCalendarTime, TbEdit, TbHome2, TbHotelService } from "react-icons/tb";

import { useBookingServices, useProperties } from "~/hooks";
import { convertResponseToProperty, Property, ServiceType } from "~/models";

interface ComponentProps extends PropsWithChildren {}

type BookingContextType = {
    step: number;
    steps: { label: string; completed: boolean; icon: JSX.Element | ReactNode }[];
    services: Omit<ServiceType, "created_at" | "updated_at">[];
    properties: Property[];
    selectedProperty: Property | null;
    selectedServices: { id: string; quantity: number }[];
    setStep: Dispatch<SetStateAction<number>>;
    setSteps: Dispatch<SetStateAction<{ label: string; completed: boolean; icon: JSX.Element | ReactNode }[]>>;
    setSelectedProperty: Dispatch<SetStateAction<Property | null>>;
    setSelectedServices: Dispatch<SetStateAction<{ id: string; quantity: number }[]>>;
};

export const BookingContext = createContext<BookingContextType>({
    step: 0,
    steps: [],
    services: [],
    properties: [],
    selectedProperty: null,
    selectedServices: [],
    setStep: () => {},
    setSteps: () => {},
    setSelectedProperty: () => {},
    setSelectedServices: () => {}
});

export const BookingProvider: FC<ComponentProps> = ({ children }) => {
    const [cookies] = useCookies(["AccessToken"]);
    const { data: propertyData } = useProperties(cookies.AccessToken);
    const { data: servicesData } = useBookingServices(cookies.AccessToken);
    const queryParams = new URLSearchParams(window.location.search);
    const [id, setId] = useState<string | null>(queryParams.get("id"));

    // states
    const [step, setStep] = useState(0);
    const [steps, setSteps] = useState<{ label: string; completed: boolean; icon: ReactNode }[]>([
        { label: "Select Property", completed: false, icon: <TbHome2 /> },
        { label: "Select Services", completed: false, icon: <TbHotelService /> },
        { label: "Select Date", completed: false, icon: <TbCalendarTime /> },
        { label: "Additional details", completed: false, icon: <TbEdit /> },
        { label: "Confirm", completed: false, icon: <TbCalendarPlus /> }
    ]);

    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const [services, setServices] = useState<Omit<ServiceType, "created_at" | "updated_at">[]>([]);
    const [selectedServices, setSelectedServices] = useState<{ id: string; quantity: number }[]>([]);

    useEffect(() => {
        if (propertyData && propertyData.properties) {
            const newProperties = [...propertyData.properties]
                .map((p: any) => convertResponseToProperty(p))
                .filter(
                    p =>
                        p.icon != null &&
                        p.label != null &&
                        p.address.line_1 != null &&
                        p.address.city != null &&
                        p.address.zip != null &&
                        p.type != null &&
                        p.user_id != null &&
                        p.rooms.length > 0
                );

            setProperties(newProperties);

            if (id) {
                const requested = newProperties.find(p => p.id == id);

                if (
                    requested &&
                    !(
                        requested.icon == null ||
                        requested.label == null ||
                        requested.address.line_1 == null ||
                        requested.address.city == null ||
                        requested.address.zip == null ||
                        requested.type == null ||
                        requested.user_id == null ||
                        requested.rooms.length < 0
                    )
                ) {
                    setSelectedProperty(requested);

                    const newSteps = [...steps];

                    newSteps[0].completed = true;

                    setSteps(newSteps);
                    setStep(1);

                    setId(null);
                } else {
                    setId(null);
                }
            }
        }
    }, [propertyData]);

    useEffect(() => {
        if (servicesData && servicesData.serviceTypes) {
            const newServices = [...servicesData.serviceTypes].map((p: any) => ({
                id: p.id,
                label: p.label,
                price: p.price,
                products: p.products,
                category: p.category,
                available: p.available,
                quantifiable: p.quantifiable
            }));

            setServices(newServices);
        }
    }, [servicesData]);

    useEffect(() => {
        if (selectedProperty) {
            const newSteps = [...steps];

            newSteps[0].completed = true;

            setSteps(newSteps);
        }
    }, [selectedProperty]);

    return (
        <BookingContext.Provider
            value={{
                step,
                steps,
                services,
                properties,
                selectedProperty,
                selectedServices,
                setStep,
                setSteps,
                setSelectedProperty,
                setSelectedServices
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};
