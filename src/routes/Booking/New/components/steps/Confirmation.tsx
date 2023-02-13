import { Accordion, Container, Divider, Group, ScrollArea, Stack, Text, Title } from "@mantine/core";

import { FC, useContext, useMemo } from "react";

import { Payment } from "../Payment";
import { BookingContext } from "../Provider";

export const ConfirmBookingStep: FC = () => {
    const { selectedProperty, startTime, endTime, selectedServices } = useContext(BookingContext);

    return (
        <ScrollArea h="100%" scrollbarSize={6}>
            <Container size="sm" p={{ base: "xs", xs: "lg" }}>
                <Title ff="Inter">Confirm your booking</Title>
                <Text color="dimmed">
                    Please review your booking details and confirm your booking. You can always change your booking
                    details later.
                </Text>
                <Accordion my="lg" variant="contained" defaultValue="summary">
                    <Accordion.Item value="summary">
                        <Accordion.Control>
                            <Title
                                fw={600}
                                order={3}
                                ff="Inter"
                                sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}
                            >
                                Summary
                            </Title>
                        </Accordion.Control>

                        <Accordion.Panel>
                            <Stack>
                                {selectedProperty ? (
                                    <Stack spacing={4}>
                                        <Title mb={8} order={4}>
                                            {selectedProperty.label}
                                        </Title>
                                        {selectedProperty.rooms.map((r, i) => (
                                            <Group key={i} mt={2} position="apart">
                                                <Text size="sm">
                                                    {r.quantity} {r.type.label.toLocaleLowerCase()}
                                                    {r.quantity != 1 ? "s" : ""}
                                                </Text>
                                                <Text size="xs" color="dimmed" fw={400}>
                                                    ${(r.type.price * r.quantity).toFixed(2)}
                                                </Text>
                                            </Group>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Text size={"xs"} color={"dimmed"}>
                                        No property selected
                                    </Text>
                                )}
                                {selectedServices.length > 0 ||
                                (startTime != null &&
                                    endTime != null &&
                                    startTime.getTime() < new Date().getTime() + 3 * 24 * 60 * 60 * 1000) ? (
                                    <>
                                        <Divider />
                                        <Stack spacing={4}>
                                            <Title
                                                order={5}
                                                sx={theme => ({
                                                    color: theme.colorScheme == "dark" ? "white" : "black"
                                                })}
                                            >
                                                Additional services
                                            </Title>
                                            {startTime != null &&
                                                endTime != null &&
                                                startTime.getTime() <
                                                    new Date().getTime() + 3 * 24 * 60 * 60 * 1000 && (
                                                    <Group mt={2} position="apart">
                                                        <Text size="sm">Last minute booking</Text>
                                                        <Text size="xs" color="dimmed" fw={400}>
                                                            $80
                                                        </Text>
                                                    </Group>
                                                )}

                                            {selectedServices.map((s, i) => (
                                                <Group key={i} mt={2} position="apart">
                                                    <Text size="xs">
                                                        {s.quantity} {s.service.label}
                                                        {s.quantity != 1 ? "s" : ""}
                                                    </Text>
                                                    <Text size="xs" color="dimmed" fw={400}>
                                                        ${(s.service.price * s.quantity).toFixed(2)}
                                                    </Text>
                                                </Group>
                                            ))}
                                        </Stack>
                                    </>
                                ) : null}
                                <Divider />
                                {startTime && endTime ? (
                                    <Stack spacing={4}>
                                        <Title
                                            order={5}
                                            sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}
                                        >
                                            {startTime?.toLocaleDateString(undefined, { dateStyle: "full" })}
                                        </Title>
                                        <Text
                                            size="sm"
                                            color={
                                                startTime.getTime() > endTime.getTime() - 3 * 60 * 60 * 1000
                                                    ? "red"
                                                    : "dimmed"
                                            }
                                        >
                                            {`${startTime?.toLocaleString("en-US", {
                                                hour12: true,
                                                hour: "numeric",
                                                minute: "numeric"
                                            })} - ${endTime?.toLocaleString("en-US", {
                                                hour12: true,
                                                hour: "numeric",
                                                minute: "numeric"
                                            })}`}
                                        </Text>
                                    </Stack>
                                ) : (
                                    <Text size={"xs"} color={"dimmed"}>
                                        No date and timeslot selected
                                    </Text>
                                )}
                                <Divider />
                                <Price />
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
                <Payment />
            </Container>
        </ScrollArea>
    );
};

const Price: FC = () => {
    const { selectedProperty, selectedServices, startTime, endTime } = useContext(BookingContext);

    const price = useMemo(() => {
        const propertyPrice = selectedProperty
            ? selectedProperty.rooms.reduce((prev, curRoom) => {
                  return prev + curRoom.type.price * curRoom.quantity;
              }, 0)
            : 0;

        const servicePrice =
            selectedServices.length > 0
                ? selectedServices.reduce((prev, curService) => {
                      return prev + curService.service.price * curService.quantity;
                  }, 0)
                : 0;

        const curDate = new Date();

        curDate.setDate(curDate.getDate() + 3);

        const bookingPrice = startTime == null ? 0 : startTime.getTime() < curDate.getTime() ? 80 : 0;

        return propertyPrice + servicePrice + bookingPrice;
    }, [selectedProperty, selectedServices, startTime, endTime]);

    return (
        <>
            <Stack spacing={8}>
                <Group mt={2} position="apart">
                    <Title order={5}>Subtotal</Title>
                    <Text size="xs" color="dimmed" fw={400}>
                        ${price.toFixed(2)}
                    </Text>
                </Group>
                <Group position="apart">
                    <Text size="sm">GST</Text>
                    <Text size="xs" color="dimmed" fw={400}>
                        ${(Math.round(price * 10) / 100).toFixed(2)}
                    </Text>
                </Group>
            </Stack>
            <Divider />
            <Group mt={2} position="apart">
                <Title order={5} sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}>
                    Total
                </Title>
                <Text size="xs" color="dimmed" fw={400}>
                    ${(price + Math.round(price * 10) / 100).toFixed(2)}
                </Text>
            </Group>
        </>
    );
};
