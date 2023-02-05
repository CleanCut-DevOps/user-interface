import { ActionIcon, Anchor, createStyles, Flex, MediaQuery, Stack, Text, Tooltip } from "@mantine/core";

import { Dispatch, FC, SetStateAction } from "react";
import { TbCalendarPlus, TbEye } from "react-icons/tb";
import { useLocation } from "wouter";

import { Property } from "~/models";

import { PropMenu } from "./Menu";

interface ComponentProps {
    properties: Property[];
    setProperties: Dispatch<SetStateAction<Property[]>>;
}

const useStyles = createStyles(theme => ({
    table: {
        gap: 0,
        boxShadow: theme.shadows.xs,
        borderRadius: theme.radius.md,
        marginInline: theme.spacing.sm,
        border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[3]}`,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            marginInline: 0
        }
    },
    tableRow: {
        alignItems: "center",
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        transition: "0.3s ease",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",

        ":first-of-type": {
            borderTopLeftRadius: theme.radius.md,
            borderTopRightRadius: theme.radius.md
        },

        ":last-of-type": {
            borderBottomLeftRadius: theme.radius.md,
            borderBottomRightRadius: theme.radius.md
        },

        "&:not(:last-of-type)": {
            borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[2]}`
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            gap: theme.spacing.sm,
            padding: theme.spacing.sm
        }
    },
    labelRow: {
        alignItems: "center",
        gap: theme.spacing.md,
        paddingInlineStart: theme.spacing.md,
        paddingInlineEnd: theme.spacing.md + 28 * 3 + theme.spacing.md * 3,
        marginInline: theme.spacing.sm,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            marginInline: 0
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            paddingInlineEnd: theme.spacing.md + 28 * 3 + theme.spacing.md * 3 - 16,
            gap: theme.spacing.sm
        }
    }
}));

export const ListView: FC<ComponentProps> = ({ properties, setProperties }) => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();

    const handleClick = (id: string) => () => setLocation(`/property/${id}`);

    return (
        <>
            <Flex className={classes.labelRow}>
                <MediaQuery largerThan="xs" styles={{ flex: 0, maxWidth: 200 }}>
                    <Text size={"xs"} color={"dimmed"} lineClamp={1} style={{ flex: 1 }}>
                        Name
                    </Text>
                </MediaQuery>
                <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                    <MediaQuery largerThan="lg" styles={{ flex: 0, maxWidth: 200 }}>
                        <Text size={"xs"} color={"dimmed"} lineClamp={1} style={{ flex: 1 }}>
                            Address
                        </Text>
                    </MediaQuery>
                </MediaQuery>
                <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
                    <Text style={{ flex: 1 }} size={"xs"} color={"dimmed"} lineClamp={1}>
                        Description
                    </Text>
                </MediaQuery>
            </Flex>
            <Stack className={classes.table}>
                {properties.map((property, i) => (
                    <Flex key={i} className={classes.tableRow}>
                        <MediaQuery largerThan="xs" styles={{ flex: 0, maxWidth: 200 }}>
                            <Anchor
                                size={"sm"}
                                weight={600}
                                lineClamp={1}
                                style={{ flex: 1, color: "inherit" }}
                                onClick={handleClick(property.id)}
                            >
                                {property.label}
                            </Anchor>
                        </MediaQuery>
                        <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                            <MediaQuery largerThan="lg" styles={{ maxWidth: 200 }}>
                                <Text size={"xs"} color={"dimmed"} lineClamp={1} style={{ flex: 1 }}>
                                    {property.address.line_1 && property.address.city
                                        ? `${property.address.line_1}, ${property.address.city}`
                                        : "Address not given"}
                                </Text>
                            </MediaQuery>
                        </MediaQuery>
                        <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
                            <Text style={{ flex: 1 }} size={"xs"} color={"dimmed"} lineClamp={1}>
                                {property.description ?? "No description"}
                            </Text>
                        </MediaQuery>
                        <Tooltip label="View bookings" position="bottom">
                            <ActionIcon variant={"default"}>
                                <TbEye />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Book now!" position="bottom">
                            <ActionIcon variant={"default"}>
                                <TbCalendarPlus />
                            </ActionIcon>
                        </Tooltip>
                        <PropMenu prop={property} setProperties={setProperties} position={"left-start"} />
                    </Flex>
                ))}
            </Stack>
        </>
    );
};
