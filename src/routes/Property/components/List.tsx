import { Property } from "~/models";

import { Anchor, createStyles, Flex, Stack, Text } from "@mantine/core";
import { Dispatch, FC, SetStateAction } from "react";
import { useLocation } from "wouter";
import { PropMenu } from "./Menu";

interface ComponentProps {
    properties: Property[];
    setProperties: Dispatch<SetStateAction<Property[]>>;
}

const useStyles = createStyles(theme => ({
    table: {
        gap: 0,
        marginInline: theme.spacing.sm,
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[4]}`
    },
    tableRow: {
        alignItems: "center",
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        transition: "0.3s ease",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : "white",

        ":hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1]
        },

        ":active": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2]
        },

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
        }
    },
    labelRow: {
        alignItems: "center",
        gap: theme.spacing.md,
        paddingInline: theme.spacing.md,
        marginInline: theme.spacing.sm
    }
}));

export const ListView: FC<ComponentProps> = ({ properties, setProperties }) => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();

    const handleClick = (id: string) => () => setLocation(`/property/${id}`);

    return (
        <>
            <Flex className={classes.labelRow}>
                <Text size={"xs"} color={"dimmed"} lineClamp={1} style={{ width: "100%", maxWidth: 200 }}>
                    Name
                </Text>
                <Text size={"xs"} color={"dimmed"} lineClamp={1} style={{ width: "100%", maxWidth: 280 }}>
                    Address
                </Text>
                <Text style={{ flex: 1, minWidth: 200 }} size={"xs"} color={"dimmed"} lineClamp={1}>
                    Description
                </Text>
                <Text size={"xs"} color={"dimmed"} lineClamp={1} style={{ width: "100%", maxWidth: 64 }}>
                    Actions
                </Text>
            </Flex>
            <Stack className={classes.table}>
                {properties.map((property, i) => (
                    <Flex key={i} className={classes.tableRow}>
                        <Anchor
                            size={"sm"}
                            weight={600}
                            lineClamp={1}
                            style={{ width: "100%", maxWidth: 200, color: "inherit" }}
                            onClick={handleClick(property.id)}
                        >
                            {property.label}
                        </Anchor>
                        <Text size={"xs"} color={"dimmed"} lineClamp={1} style={{ width: "100%", maxWidth: 280 }}>
                            {property.address.city && property.address.line_1
                                ? `${property.address.city}, ${property.address.line_1}`
                                : "Address not given"}
                        </Text>
                        <Text style={{ flex: 1, minWidth: 200 }} size={"xs"} color={"dimmed"} lineClamp={1}>
                            {property.description}
                        </Text>

                        <div style={{ width: "100%", maxWidth: 64, zIndex: 2 }}>
                            <PropMenu prop={property} setProperties={setProperties} />
                        </div>
                    </Flex>
                ))}
            </Stack>
        </>
    );
};
