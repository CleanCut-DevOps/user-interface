import { Accordion, Button, Stack, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import axios from "axios";
import { FC, useContext } from "react";
import { useCookies } from "react-cookie";
import { SiVisa } from "react-icons/si";
import { TbPlus } from "react-icons/tb";
import { useLocation } from "wouter";

import { BookingContext } from "./Provider";

export const Payment: FC = () => {
    const [cookies] = useCookies(["AccessToken"]);
    const [, setLocation] = useLocation();
    const { selectedProperty, startTime, endTime, selectedServices, contact, info } = useContext(BookingContext);

    const handleClick = () => {
        if (
            selectedProperty &&
            startTime != null &&
            endTime != null &&
            info &&
            startTime.getTime() < endTime.getTime() - 3 * 60 * 60 * 1000
        ) {
            const services = selectedServices
                ? selectedServices.map(s => ({
                      id: s.service.id,
                      quantity: s.quantity
                  }))
                : undefined;

            const fData = {
                property_id: selectedProperty?.id,
                start_time: startTime,
                end_time: endTime,
                secondary_contact: contact,
                additional_information: info
            };

            if (services) {
                Object.assign(fData, services);
            }

            axios
                .post(`${import.meta.env.VITE_BOOKING_API}/bookings`, fData, {
                    headers: { Authorization: `Bearer ${cookies.AccessToken}` }
                })
                .then(() => {
                    showNotification({
                        title: "Booking successful",
                        message: "Your booking has been successfully created",
                        color: "teal"
                    });
                    setLocation("/");
                });
        } else {
            showNotification({
                title: "Booking failed",
                message: "Please ensure all fields are filled out correctly",
                color: "red"
            });
        }
    };

    return (
        <Accordion variant="contained">
            <Accordion.Item value="payment">
                <Accordion.Control>
                    <Title
                        fw={600}
                        order={3}
                        ff="Inter"
                        sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}
                    >
                        Payment
                    </Title>
                </Accordion.Control>
                <Accordion.Panel>
                    <Title order={5} sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}>
                        Saved payment methods
                    </Title>
                    <Stack mt={16} spacing={8}>
                        <Button
                            size="lg"
                            variant="default"
                            leftIcon={<SiVisa />}
                            styles={{ inner: { justifyContent: "start" } }}
                            onClick={handleClick}
                        >
                            Visa
                        </Button>
                        <Button
                            size="lg"
                            variant="default"
                            leftIcon={<TbPlus />}
                            styles={{ inner: { justifyContent: "start" } }}
                        >
                            Add payment method
                        </Button>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};
