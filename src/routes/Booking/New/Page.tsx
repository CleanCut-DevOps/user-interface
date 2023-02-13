import { Stack } from "@mantine/core";

import { FC, useContext } from "react";

import { AuthWrapper } from "../../../components";
import { BookingLayout } from "./components/Layout";
import { BookingContext, BookingProvider } from "./components/Provider";
import {
    AdditionalInformationStep,
    ConfirmBookingStep,
    SelectDateStep,
    SelectPropertyStep,
    SelectServicesStep
} from "./components/steps";

export const NewBooking: FC = () => {
    return (
        <AuthWrapper requireAuth>
            <BookingProvider>
                <BookingLayout>
                    <Stack h="100%">
                        <DisplayStep />
                    </Stack>
                </BookingLayout>
            </BookingProvider>
        </AuthWrapper>
    );
};

const DisplayStep: FC = () => {
    const { step } = useContext(BookingContext);

    switch (step) {
        case 0:
            return <SelectPropertyStep />;
        case 1:
            return <SelectDateStep />;
        case 2:
            return <SelectServicesStep />;
        case 3:
            return <AdditionalInformationStep />;
        case 4:
            return <ConfirmBookingStep />;
        default:
            return <SelectPropertyStep />;
    }
};
