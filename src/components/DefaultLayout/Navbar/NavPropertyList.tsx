import { ActionIcon, createStyles, Group, Navbar, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { FC } from "react";
import { useCookies } from "react-cookie";
import { TbPlus } from "react-icons/tb";
import { useQuery } from "react-query";
import { Link, useLocation } from "wouter";
import { Property } from "../../../models";

const useStyles = createStyles(theme => ({
    section: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing.sm
    },
    grow: {
        flex: "1 !important",
        height: "100%",
        overflow: "hidden"
    },
    link: {
        cursor: "pointer",
        userSelect: "none",
        borderRadius: theme.radius.md,
        padding: `${theme.spacing.xs - 4}px ${theme.spacing.sm}px`,
        transition: "0.2s ease",

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
        },
        "&:active": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[1]
        }
    },
    header: {
        padding: `0 ${theme.spacing.sm}px}`
    }
}));

const fetchPropertyList = (accessToken: string | undefined) => async () => {
    if (accessToken === undefined) {
        return [];
    } else {
        const propertyList: Property[] = await axios
            .get(`${import.meta.env.VITE_PROPERTY_API}/property`, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            .then(({ data }) => {
                return data.properties;
            });

        return propertyList;
    }
};

export const NavPropertyList: FC = () => {
    const [cookie] = useCookies(["AccessToken"]);
    const { classes } = useStyles();
    const [value, toggle] = useToggle();
    const [, setLocation] = useLocation();
    const { data, isLoading, isError, isSuccess } = useQuery("property-list", fetchPropertyList(cookie.AccessToken));

    const handleClick = async () => {
        toggle();

        await axios
            .post(
                `${import.meta.env.VITE_PROPERTY_API}/property`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${cookie.AccessToken}`
                    }
                }
            )
            .then(({ data }) => {
                toggle();
                setLocation(`/property/${data.property.id}/edit`);
            })
            .catch(() => {
                toggle();
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
                        <ActionIcon size={18} loading={value} variant={"default"} onClick={handleClick}>
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
                {isSuccess && (
                    <Stack spacing={8}>
                        {data.map((property: Property) => (
                            <Link key={property.id} href={`/property/${property.id}`}>
                                <Group className={classes.link}>
                                    <Text size={12}>{property.icon}</Text>
                                    <Text size={12}>{property.label}</Text>
                                </Group>
                            </Link>
                        ))}
                    </Stack>
                )}
            </Navbar.Section>
        </>
    );
};
