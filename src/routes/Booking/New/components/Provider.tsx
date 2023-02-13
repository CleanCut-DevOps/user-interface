import { createContext, Dispatch, FC, PropsWithChildren, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbCalendarPlus, TbCalendarTime, TbEdit, TbHome2, TbHotelService } from "react-icons/tb";

import { useBookingServices, useProperties } from "~/hooks";
import { convertResponseToProperty, Property, ServiceType } from "~/models";

interface ComponentProps extends PropsWithChildren {}

type BookingContextType = {
    step: number;
    steps: { label: string; completed: boolean; icon: JSX.Element | ReactNode }[];
    properties: Property[];
    endTime: Date | null;
    startTime: Date | null;
    services: Omit<ServiceType, "created_at" | "updated_at">[];
    info: string;
    contact: string;
    selectedProperty: Property | null;
    selectedServices: { service: Omit<ServiceType, "created_at" | "updated_at">; quantity: number }[];
    setStep: Dispatch<SetStateAction<number>>;
    setSteps: Dispatch<SetStateAction<{ label: string; completed: boolean; icon: JSX.Element | ReactNode }[]>>;
    setSelectedProperty: Dispatch<SetStateAction<Property | null>>;
    setEndTime: Dispatch<SetStateAction<Date | null>>;
    setStartTime: Dispatch<SetStateAction<Date | null>>;
    setSelectedServices: Dispatch<
        SetStateAction<{ service: Omit<ServiceType, "created_at" | "updated_at">; quantity: number }[]>
    >;
    setInfo: Dispatch<SetStateAction<string>>;
    setContact: Dispatch<SetStateAction<string>>;
};

export const BookingContext = createContext<BookingContextType>({
    step: 0,
    steps: [],
    services: [],
    properties: [],
    info: "",
    contact: "",
    endTime: null,
    startTime: null,
    selectedProperty: null,
    selectedServices: [],
    setStep: () => {},
    setSteps: () => {},
    setSelectedProperty: () => {},
    setStartTime: () => {},
    setEndTime: () => {},
    setSelectedServices: () => {},
    setInfo: () => {},
    setContact: () => {}
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
        { label: "Select Date", completed: false, icon: <TbCalendarTime /> },
        { label: "Select Services", completed: true, icon: <TbHotelService /> },
        { label: "Additional details", completed: true, icon: <TbEdit /> },
        { label: "Confirm", completed: false, icon: <TbCalendarPlus /> }
    ]);

    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const [services, setServices] = useState<Omit<ServiceType, "created_at" | "updated_at">[]>([]);
    const [selectedServices, setSelectedServices] = useState<
        {
            service: Omit<ServiceType, "created_at" | "updated_at">;
            quantity: number;
        }[]
    >([]);

    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);

    const [contact, setContact] = useState("");
    const [info, setInfo] = useState("");

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
        if (selectedProperty != null) {
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
                startTime,
                endTime,
                selectedServices,
                info,
                contact,
                setStep,
                setSteps,
                setSelectedProperty,
                setStartTime,
                setEndTime,
                setSelectedServices,
                setInfo,
                setContact
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};
