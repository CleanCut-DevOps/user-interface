import {
    ActionIcon,
    createStyles,
    Group,
    Navbar,
    ScrollArea,
    Skeleton,
    Stack,
    Text,
    Tooltip,
    UnstyledButton
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbPlus } from "react-icons/tb";
import { Link, useLocation } from "wouter";

import { useProperties } from "~/hooks";
import { convertResponseToProperty, Property } from "~/models";

const useStyles = createStyles(theme => ({
    section: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing.sm,

        ":last-of-type": { padding: 0 }
    },
    grow: {
        height: "100%",
        overflow: "hidden",
        flex: "1 !important"
    },
    link: {
        cursor: "pointer",
        userSelect: "none",
        transition: "background-color 0.2s ease",
        borderRadius: theme.radius.md,
        padding: `${theme.spacing.xs - 4}px ${theme.spacing.sm}px`,

        ":hover": { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
        ":active": { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[1] },

        ":focus:not(:focus-visible)": { outline: "none" },

        ":focus": {
            outline: `2px solid ${theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5]}`
        }
    },
    header: {
        padding: `0 ${theme.spacing.sm}px}`
    }
}));

export const NavPropertyList: FC = () => {
    const [cookie] = useCookies(["AccessToken"]);
    const { classes } = useStyles();
    const [createLoading, { close, open, toggle }] = useDisclosure(false);
    const [, setLocation] = useLocation();
    const [properties, setProperties] = useState<Property[]>([]);
    const { data, isError, isLoading } = useProperties(cookie.AccessToken);

    useEffect(() => {
        if (data) {
            const newProperties = data.properties.map((property: any) => convertResponseToProperty(property));

            setProperties(newProperties);
        }
    }, [data]);

    const handleClick = async () => {
        open();

        await axios
            .post(
                `${import.meta.env.VITE_PROPERTY_API}`,
                {},
                { headers: { Authorization: `Bearer ${cookie.AccessToken}` } }
            )
            .then(({ data }) => {
                setLocation(`/property/${data.property.id}/edit`);
            })
            .catch(() => {
                close();

                showNotification({
                    title: "🚩 Unsuccessful Request",
                    message: "Could not create property, please try again later.",
                    color: "red"
                });
            });
    };

    return (
        <>
            <Navbar.Section className={classes.section}>
                <Group className={classes.header} position="apart">
                    <Text size="xs" weight={500} color="dimmed">
                        Your properties
                    </Text>
                    <Tooltip fz={12} withArrow position="right" label="Create property">
                        <ActionIcon size={18} loading={createLoading} variant={"default"} onClick={handleClick}>
                            <TbPlus size={12} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Navbar.Section>
            <Navbar.Section className={`${classes.section} ${classes.grow}`}>
                {isLoading && (
                    <Stack spacing={18} mt={10}>
                        {[...Array(Math.round(Math.random() * 5))].map((_, i) => (
                            <Skeleton key={i} visible radius={"md"}>
                                <Text size={12}>Loading</Text>
                            </Skeleton>
                        ))}
                    </Stack>
                )}
                {isError && <Text>Error loading in your properties. Reload the site or come back in a while</Text>}
                {!isLoading && !isError && data && (
                    <ScrollArea scrollbarSize={6}>
                        <Stack p="sm" spacing={8}>
                            {properties.map((property: Property) => (
                                <Link key={property.id} href={`/property/${property.id}`}>
                                    <UnstyledButton className={classes.link}>
                                        <Group>
                                            <Text size={12}>{property.icon}</Text>
                                            <Text size={12}>{property.label}</Text>
                                        </Group>
                                    </UnstyledButton>
                                </Link>
                            ))}
                        </Stack>
                    </ScrollArea>
                )}
            </Navbar.Section>
        </>
    );
};
