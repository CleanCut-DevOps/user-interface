import { Anchor, Button, createStyles, Flex, Group, Paper, SimpleGrid, Stack, Tabs, Text, Title } from "@mantine/core";

import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbCalendarEvent, TbCheck, TbCircleX, TbHome2, TbListDetails } from "react-icons/tb";
import { useLocation } from "wouter";

import { AuthWrapper, DashboardLayout, Loading } from "~/components";
import { useBooking, useProperty } from "~/hooks";
import { Booking, convertResponseToBooking, convertResponseToProperty, Property } from "~/models";

import { BookingsPanel } from "./components/BookingTabPanel";
import { PropertyDetailsPanel } from "./components/DetailsTabPanel";

type ComponentProps = { params: { id: string } };

const useStatStyles = createStyles(theme => ({
    stat: {
        color: theme.colorScheme == "dark" ? "white" : "black",
        fontWeight: theme.colorScheme == "dark" ? 600 : 700
    },
    upcoming: { color: theme.colors.yellow[6] },
    completed: { color: theme.colors.teal[6] },
    rejected: { color: theme.colors.red[6] }
}));

export const ViewProperty: FC<ComponentProps> = ({ params: { id } }) => {
    const { classes: statClasses } = useStatStyles();
    const [cookies] = useCookies(["AccessToken"]);
    const [loading, setLoading] = useState(true);
    const [, setLocation] = useLocation();

    const [tabValue, setTabValue] = useState<string | null>("details");

    // Data fetching
    const { data: bookingData, isLoading: bookingLoading } = useBooking(id, cookies.AccessToken);
    const { data: propertyData, isLoading: propertyLoading } = useProperty(id, cookies.AccessToken);

    // States
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [property, setProperty] = useState<Property | null>(null);

    useEffect(() => {
        if (!propertyLoading) {
            if (propertyData) setProperty(convertResponseToProperty(propertyData.property));
        }

        if (!bookingLoading) {
            if (bookingData) setBookings([...bookingData.bookings].map(convertResponseToBooking));
        }

        if (!propertyLoading && !bookingLoading) {
            if (!propertyData || !bookingData) {
                setLocation("/");
            } else setLoading(false);
        }
    }, [propertyData, propertyLoading, bookingData, bookingLoading]);

    if (loading) return <Loading />;

    return (
        <AuthWrapper requireAuth>
            <DashboardLayout>
                <Stack pt="xl" spacing="xl" p={{ base: "sm", sm: "xl" }}>
                    <Flex justify={"space-between"} align="end">
                        <Stack spacing={8}>
                            <Title order={2} ff="Inter" inline>
                                {property?.icon} {property?.label}
                            </Title>
                            <Group spacing={10}>
                                <TbHome2 /> <b>·</b> <Anchor color="dimmed">Properties</Anchor> <b>·</b>{" "}
                                <Text>View Details</Text>
                            </Group>
                        </Stack>
                        <Button
                            variant="outline"
                            leftIcon={<TbCalendarEvent />}
                            onClick={() => setLocation(`/bookings/new?id=${id}`)}
                        >
                            Book now!
                        </Button>
                    </Flex>
                    <SimpleGrid cols={3} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
                        <Paper withBorder p="md" radius="md">
                            <Flex justify={"space-between"}>
                                <Text color="teal" weight={700} size="xl" className={statClasses.stat}>
                                    {bookings.filter(b => b.start_time.getTime() > new Date().getTime()).length}
                                </Text>
                                <TbCalendarEvent className={statClasses.upcoming} />
                            </Flex>
                            <Text color="dimmed" size="sm" weight={500}>
                                Upcoming bookings
                            </Text>
                        </Paper>
                        <Paper withBorder p="md" radius="md">
                            <Flex justify={"space-between"}>
                                <Text color="yellow" weight={700} size="xl" className={statClasses.stat}>
                                    {
                                        bookings.filter(
                                            b =>
                                                b.complete_at != null &&
                                                b.complete_at.getTime() > new Date().setDate(new Date().getDate() - 7)
                                        ).length
                                    }
                                </Text>
                                <TbCheck className={statClasses.completed} />
                            </Flex>
                            <Text color="dimmed" size="sm" weight={500}>
                                Completed recently
                            </Text>
                        </Paper>
                        <Paper withBorder p="md" radius="md">
                            <Flex justify={"space-between"}>
                                <Text color="red" weight={700} size="xl" className={statClasses.stat}>
                                    {bookings.filter(b => b.rejected_at != null).length}
                                </Text>
                                <TbCircleX className={statClasses.rejected} />
                            </Flex>
                            <Text color="dimmed" size="sm" weight={500}>
                                Rejected bookings
                            </Text>
                        </Paper>
                    </SimpleGrid>
                    <Tabs
                        variant="default"
                        value={tabValue}
                        onTabChange={e => setTabValue(e)}
                        styles={{ tab: { transition: "0.3s ease", fontWeight: 500 } }}
                    >
                        <Tabs.List>
                            <Tabs.Tab value="details" icon={<TbListDetails />}>
                                Property details
                            </Tabs.Tab>
                            <Tabs.Tab value="bookings" icon={<TbCalendarEvent />}>
                                Bookings
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="details" pt="xs">
                            {property ? <PropertyDetailsPanel property={property} /> : <Loading />}
                        </Tabs.Panel>

                        <Tabs.Panel value="bookings" pt="xs">
                            <BookingsPanel bookings={bookings} />
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
            </DashboardLayout>
        </AuthWrapper>
    );
};
