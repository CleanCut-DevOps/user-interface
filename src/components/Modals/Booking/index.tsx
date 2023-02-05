import {
    Accordion,
    Button,
    createStyles,
    Flex,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
    useMantineTheme
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { openModal } from "@mantine/modals";

import axios from "axios";
import { FC, Fragment, useEffect, useState } from "react";

import { Property } from "~/models";

import { Addons } from "./Addon";

interface ComponentProps {
    prop: Property;
}

type AddOn = { title: string; items: AddOnItem[] };

type AddOnItem = { id: string; label: string; price: number; products: string[] };

type BookingRequest = {
    id: string;
    addOns: { id: string; quantity: number }[];
    selectedDate: Date;
    startTime: any;
    endTime: any;
};

const items = [
    {
        id: "01",
        category: "Toiletries",
        label: "Bath set",
        price: 5,
        products: ["1x Bath Mat", "1x Hand Towels", "2x Face Washers"]
    },
    {
        id: "02",
        category: "Toiletries",
        label: "Towel set",
        price: 2.5,
        products: ["2x Bath Towels"]
    },
    {
        id: "03",
        category: "Supplies and Amenities",
        label: "Bathroom Pack",
        price: 8.5,
        products: ["1x Body Wash", "1x Body Lotion", "3x Toilet Paper", "1x Cleansing Soap", "1x Cleansing Shampoo"]
    },
    {
        id: "04",
        category: "Supplies and Amenities",
        label: "Kitchen Pack",
        price: 6.5,
        products: [
            "1x Domestic Wipe",
            "1x Sponge+Scourer",
            "1x Laundry Powder",
            "3x Extra Bin Liners",
            "1x Dishwashing Liquid",
            "1x Dishwashing Tablet"
        ]
    },
    {
        id: "05",
        category: "Supplies and Amenities",
        label: "Beverages Pack",
        price: 5,
        products: ["1x Milk", "2x Tea", "2x Coffee", "2x Sugar"]
    },
    {
        id: "06",
        category: "Extras",
        label: "Deep Clean / Extended Clean",
        price: 50,
        products: ["Charged in blocks of 1 hour"]
    },
    {
        id: "07",
        category: "Extras",
        label: "Ad Hoc Tasks",
        price: 50,
        products: ["$50 per task OR per hour (Non-cleaning tasks only)"]
    }
];

const setNewTimeslots = (sd: Date): { newStartTime: Date; newEndTime: Date }[] => {
    return [
        (() => {
            const newStartTime = new Date(sd);
            const newEndTime = new Date(sd);
            newStartTime.setHours(7, 0, 0, 0);
            newEndTime.setHours(12, 0, 0, 0);

            return {
                newStartTime,
                newEndTime
            };
        })(),
        (() => {
            const newStartTime = new Date(sd);
            const newEndTime = new Date(sd);
            newStartTime.setHours(13, 0, 0, 0);
            newEndTime.setHours(16, 0, 0, 0);

            return {
                newStartTime,
                newEndTime
            };
        })(),
        (() => {
            const newStartTime = new Date(sd);
            const newEndTime = new Date(sd);
            newStartTime.setHours(16, 0, 0, 0);
            newEndTime.setHours(19, 0, 0, 0);

            return {
                newStartTime,
                newEndTime
            };
        })(),
        (() => {
            const newStartTime = new Date(sd);
            const newEndTime = new Date(sd);
            newStartTime.setHours(19, 0, 0, 0);
            newEndTime.setDate(newEndTime.getDate() + 1);
            newEndTime.setHours(7, 0, 0, 0);

            return {
                newStartTime,
                newEndTime
            };
        })()
    ];
};

const useStyles = createStyles(theme => ({
    labelRow: {
        justifyContent: "space-between",
        alignItems: "flex-end",

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            gap: theme.spacing.sm,
            justifyContent: "normal",
            alignItems: "normal",
            flexDirection: "column"
        }
    },
    accordionRow: {
        backgroundColor: "inherit !important",
        border: 0
    }
}));

export const openBookingModal = (prop: Property) => {
    openModal({
        size: "lg",
        title: "Create a booking",
        children: <BookingModal prop={prop} />,
        styles: theme => ({
            inner: { overflow: "hidden" },
            body: { flex: 1, overflow: "hidden", display: "flex" },
            title: { fontWeight: 700, color: theme.colorScheme == "dark" ? "white" : "black" },
            modal: { maxHeight: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }
        })
    });
};

export const BookingModal: FC<ComponentProps> = ({ prop }) => {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [addOns, setAddOns] = useState<AddOn[]>([]);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [timeslots, setTimeslots] = useState<{ newStartTime: Date; newEndTime: Date }[]>(setNewTimeslots(new Date()));

    useEffect(() => {
        setTimeslots(setNewTimeslots(selectedDate));
        if (startTime && endTime) {
            if (startTime.getHours() === 19 && endTime.getHours() === 7) {
                let newStartTime = new Date(selectedDate);
                let newEndTime = new Date(selectedDate);
                newStartTime.setHours(19, 0, 0, 0);
                newEndTime.setDate(newEndTime.getDate() + 1);
                newEndTime.setHours(7, 0, 0, 0);

                setStartTime(newStartTime);
                setEndTime(newEndTime);
            } else {
                let newStartTime = new Date(selectedDate);
                let newEndTime = new Date(selectedDate);
                newStartTime.setHours(startTime.getHours(), 0, 0, 0);
                newEndTime.setHours(endTime.getHours(), 0, 0, 0);

                setStartTime(newStartTime);
                setEndTime(newEndTime);
            }
        } else {
            setStartTime(null);
            setEndTime(null);
        }
    }, [selectedDate]);

    useEffect(() => {
        let newItems: AddOn[] = [];

        items.forEach(item => {
            const index = newItems.findIndex(addOn => addOn.title === item.category);

            if (index === -1) {
                newItems.push({
                    title: item.category,
                    items: [{ id: item.id, label: item.label, price: item.price, products: item.products }]
                });
            } else {
                newItems[index].items.push({
                    id: item.id,
                    label: item.label,
                    price: item.price,
                    products: item.products
                });
            }
        });

        setAddOns(newItems);
    }, [items]);

    const handleBookingDate = (e: Date | null) => {
        setSelectedDate(e ?? new Date());
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const addOns: { id: string; quantity: number }[] = [];

        items.forEach(item => {
            let itemData = document.getElementById(`addon-${item.id}`) as HTMLInputElement;

            if (Number(itemData.value) > 0) {
                addOns.push({
                    id: item.id,
                    quantity: Number(itemData.value)
                });
            }
        });

        const formData: BookingRequest = {
            id: prop.id,
            addOns,
            selectedDate,
            startTime: startTime,
            endTime: endTime
        };
    };
    return (
        <ScrollArea style={{ flex: 1 }} scrollbarSize={6}>
            <form onSubmit={handleSubmit}>
                <Stack>
                    <Flex mt="md" justify={"space-between"} align={"end"} className={classes.labelRow}>
                        <Stack spacing={0}>
                            <Text color="dimmed" size="xs">
                                {prop.type?.label ?? "No type specified"}
                            </Text>
                            <Text
                                size="sm"
                                fw={600}
                                sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}
                            >
                                {prop.label}
                            </Text>
                        </Stack>
                        <Text size="sm" fw={600} color={"dimmed"}>
                            Base price: $
                            {prop.rooms
                                .sort((a, b) => a.type.label.localeCompare(b.type.label))
                                .map(room => room.quantity * room.type.price)
                                .reduce((partialSum, a) => partialSum + a, 0)
                                .toFixed(2)}
                        </Text>
                    </Flex>
                    <Text fw={600} sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}>
                        Booking Date
                    </Text>
                    <Calendar
                        fullWidth
                        value={selectedDate}
                        initialMonth={new Date()}
                        onChange={handleBookingDate}
                        dayStyle={day => ({
                            backgroundColor:
                                day.toDateString() == selectedDate.toDateString()
                                    ? `${theme.colors.indigo[8]}4D`
                                    : "inherit",
                            transition: "0.2s ease"
                        })}
                    />
                    <Text fw={600} sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}>
                        Timeslot
                    </Text>
                    <SimpleGrid cols={1} breakpoints={[{ minWidth: 420, cols: 2 }]}>
                        {timeslots.map(({ newStartTime, newEndTime }, i) => {
                            return (
                                <Button
                                    key={i}
                                    color="indigo"
                                    variant="subtle"
                                    sx={theme => ({
                                        transition: "0.2s ease",
                                        backgroundColor:
                                            startTime?.getTime() == newStartTime?.getTime()
                                                ? `${theme.colors.indigo[8]}4D`
                                                : undefined
                                    })}
                                    onClick={() => {
                                        setEndTime(newEndTime);
                                        setStartTime(newStartTime);
                                    }}
                                >
                                    <Text sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}>
                                        {newStartTime.toTimeString().slice(0, 5)} -{" "}
                                        {newEndTime.toTimeString().slice(0, 5)}
                                    </Text>
                                </Button>
                            );
                        })}
                    </SimpleGrid>
                    <Accordion
                        radius="sm"
                        variant="contained"
                        styles={{
                            chevron: { margin: 0 },
                            content: { padding: 0, paddingTop: 0, paddingBottom: 12 },
                            control: { width: "auto", flex: 0, ":hover": { backgroundColor: "inherit" } }
                        }}
                    >
                        <Accordion.Item value="0" className={classes.accordionRow}>
                            <Accordion.Control py={12} px={0}>
                                <Text
                                    fw={600}
                                    sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}
                                >
                                    Add-ons
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack spacing="xs">
                                    {addOns.map((addOn, i) => (
                                        <Fragment key={i}>
                                            <Text
                                                fw={500}
                                                sx={theme => ({
                                                    color: theme.colorScheme == "dark" ? "white" : "black"
                                                })}
                                            >
                                                {addOn.title}
                                            </Text>
                                            {addOn.items.map((item, i) => (
                                                <Addons key={i} item={item} />
                                            ))}
                                        </Fragment>
                                    ))}
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                    <Button
                        type="submit"
                        color="indigo"
                        variant="light"
                        disabled={selectedDate == null || startTime == null || endTime == null}
                    >
                        Book
                    </Button>
                </Stack>
            </form>
        </ScrollArea>
    );
};
