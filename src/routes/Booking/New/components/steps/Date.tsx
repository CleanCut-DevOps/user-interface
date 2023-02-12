import {
    Accordion,
    Button,
    Container,
    Flex,
    Group,
    ScrollArea,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    Title
} from "@mantine/core";
import { Calendar, TimeInput } from "@mantine/dates";
import { FC, useContext, useEffect } from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { BookingContext } from "../Provider";

export const SelectDateStep: FC = () => {
    const { steps, startTime, endTime, setStartTime, setEndTime, setStep, setSteps } = useContext(BookingContext);

    useEffect(() => {
        const newStartTime = new Date();
        const newEndTime = new Date();

        newStartTime.setHours(7, 0, 0, 0);
        newEndTime.setHours(19, 0, 0, 0);

        setStartTime(newStartTime);
        setEndTime(newEndTime);

        const newSteps = [...steps];

        newSteps[1].completed = true;

        setSteps(newSteps);
    }, []);

    const handleBasicChange = (start: number, end: number) => () => {
        const newStartTime = startTime == null ? new Date() : new Date(startTime);
        const newEndTime = endTime == null ? new Date() : new Date(endTime);

        newStartTime.setHours(start, 0, 0, 0);
        newEndTime.setHours(end, 0, 0, 0);

        setStartTime(newStartTime);

        setEndTime(newEndTime);
    };

    const handleDateChange = (d: Date | null) => {
        const newStartTime = d ?? new Date();
        const newEndTime = d ?? new Date();

        newStartTime.setHours(startTime!.getHours(), 0, 0, 0);
        newEndTime.setHours(endTime!.getHours(), 0, 0, 0);

        setStartTime(newStartTime);

        setEndTime(newEndTime);
    };

    return (
        <ScrollArea h="100%" scrollbarSize={6}>
            <Container size="sm" p={{ base: "xs", xs: "lg" }}>
                <Title ff="Inter">When should we come?</Title>
                <Text color="dimmed">
                    Select the date of the booking and the time we should arrive. You can also select the time we should
                    leave.
                </Text>
                <Stack my={12}>
                    <Accordion variant="contained" defaultValue="date" styles={{ item: { border: 0 } }}>
                        <Accordion.Item value="date">
                            <Accordion.Control>
                                <Text
                                    fw={500}
                                    sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}
                                >
                                    Date of booking
                                </Text>
                                <Text>{startTime?.toLocaleDateString(undefined, { dateStyle: "full" })}</Text>
                            </Accordion.Control>

                            <Accordion.Panel>
                                <Calendar
                                    fullWidth
                                    value={startTime}
                                    onChange={handleDateChange}
                                    excludeDate={date => {
                                        const curDate = new Date();
                                        curDate.setHours(0, 0, 0, 0);

                                        return date.getTime() <= curDate.getTime() - 1;
                                    }}
                                />
                                <Text mt={8} color="dimmed">
                                    <Text color="red" span>
                                        *
                                    </Text>{" "}
                                    Bookings that are less than 3 days in advance will be charged with a last minute
                                    booking fee of $80.
                                </Text>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                    <Accordion variant="contained" defaultValue="date" styles={{ item: { border: 0 } }}>
                        <Accordion.Item value="date">
                            <Accordion.Control>
                                <Text
                                    fw={500}
                                    sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}
                                >
                                    Timeslot
                                </Text>
                                <Text>
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
                            </Accordion.Control>

                            <Accordion.Panel>
                                <Tabs defaultValue="basic">
                                    <Tabs.List grow>
                                        <Tabs.Tab value="basic">Basic</Tabs.Tab>
                                        <Tabs.Tab value="custom">Custom</Tabs.Tab>
                                    </Tabs.List>
                                    <Tabs.Panel value="basic">
                                        <SimpleGrid
                                            mt={16}
                                            cols={2}
                                            spacing={8}
                                            breakpoints={[{ maxWidth: "xs", cols: 1 }]}
                                        >
                                            <Button variant="light" onClick={handleBasicChange(7, 19)}>
                                                7am - 7pm
                                            </Button>
                                            <Button variant="light" onClick={handleBasicChange(10, 15)}>
                                                10am - 3pm
                                            </Button>
                                            <Button variant="light" onClick={handleBasicChange(10, 19)}>
                                                10am - 7pm
                                            </Button>
                                            <Button variant="light" onClick={handleBasicChange(13, 19)}>
                                                1pm - 7pm
                                            </Button>
                                        </SimpleGrid>
                                        <Text mt={8} color="dimmed">
                                            <Text color="red" span>
                                                *
                                            </Text>{" "}
                                            If you need a custom timeslot, please switch to the custom tab.
                                        </Text>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="custom">
                                        <Stack mt={16} spacing={8}>
                                            <TimeInput
                                                format="12"
                                                value={startTime}
                                                label="Start time"
                                                onChange={d => setStartTime(d)}
                                            />
                                            <TimeInput
                                                format="12"
                                                value={endTime}
                                                label="End time"
                                                onChange={d => setEndTime(d)}
                                                error={
                                                    startTime != null && endTime != null
                                                        ? endTime.getTime() - startTime.getTime() < 0
                                                            ? "End time must be after start time"
                                                            : endTime.getTime() - startTime.getTime() <
                                                              3 * 60 * 60 * 1000
                                                            ? "Minimum of 3 hours between start and end time"
                                                            : undefined
                                                        : "Error setting timeslot"
                                                }
                                            />
                                        </Stack>
                                        <Text mt={8} color="dimmed">
                                            <Text color="red" span>
                                                *
                                            </Text>{" "}
                                            A minimum of 3 hours is required between the start and end of your desired
                                            timeslot
                                        </Text>
                                    </Tabs.Panel>
                                </Tabs>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Stack>

                <Flex justify="end">
                    <Group>
                        <Button variant="outline" leftIcon={<TbChevronLeft />} onClick={() => setStep(0)}>
                            Previous
                        </Button>
                        <Button variant="outline" rightIcon={<TbChevronRight />} onClick={() => setStep(2)}>
                            Next
                        </Button>
                    </Group>
                </Flex>
            </Container>
        </ScrollArea>
    );
};
