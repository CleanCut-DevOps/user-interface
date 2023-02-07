import {
    ActionIcon,
    Button,
    Center,
    createStyles,
    Divider,
    Flex,
    Menu,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import axios from "axios";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbCheck, TbFilter, TbLayoutGrid, TbListDetails, TbWreckingBall } from "react-icons/tb";
import { useLocation } from "wouter";

import { AuthWrapper, DashboardLayout, Loading } from "~/components";
import { useProperties } from "~/hooks";
import { convertResponseToProperty, Property } from "~/models";

import { GridView } from "./components/Grid";
import { ListView } from "./components/List";

const sortOptions = [
    { label: "Alphabetical", value: "alphabetical" },
    { label: "Date Created", value: "created" },
    { label: "Date Updated", value: "updated" }
];

const directionOptions = [
    { label: "Ascending", value: true },
    { label: "Descending", value: false }
];

const useStyles = createStyles(theme => ({
    placeholderSection: {
        height: 120
    },
    activeButton: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
        transition: "0.3s ease"
    },
    filterIcon: {
        border: theme.colorScheme === "dark" ? "none" : undefined,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : "white",
        boxShadow: theme.colorScheme === "dark" ? "none" : theme.shadows.xs
    }
}));

export const PropertyCollection: FC = () => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const [cookie, setCookie] = useCookies(["AccessToken", "PropertyCollectionConfig"]);
    const { data, isError, isLoading } = useProperties(cookie.AccessToken);

    // states
    const [direction, setDirection] = useState<boolean>(cookie.PropertyCollectionConfig?.direction ?? true);
    const [properties, setProperties] = useState<Property[]>([]);
    const [viewType, setViewType] = useState<"List" | "Grid">(cookie.PropertyCollectionConfig?.viewType ?? "Grid");
    const [sort, setSort] = useState<"alphabetical" | "created" | "updated">(
        cookie.PropertyCollectionConfig?.sort ?? "alphabetical"
    );

    useEffect(() => {
        if (data) {
            const newProperties = [...data.properties.map((p: any) => convertResponseToProperty(p))].sort((a, b) => {
                if (sort == "alphabetical") {
                    return direction ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label);
                } else if (sort == "created") {
                    return direction
                        ? a.created_at.getTime() - b.created_at.getTime()
                        : b.created_at.getTime() - a.created_at.getTime();
                } else if (sort == "updated") {
                    return direction
                        ? a.updated_at.getTime() - b.updated_at.getTime()
                        : b.updated_at.getTime() - a.updated_at.getTime();
                }

                return 0;
            });

            setProperties(newProperties);
        }
    }, [sort, direction, data]);

    const handleSortChange = (value: string) => () => {
        setCookie("PropertyCollectionConfig", JSON.stringify({ ...cookie.PropertyCollectionConfig, sort: value }), {
            secure: true,
            sameSite: "strict"
        });

        setSort(value as any);
    };

    const handleDirectionChange = (value: boolean) => () => {
        setCookie(
            "PropertyCollectionConfig",
            JSON.stringify({ ...cookie.PropertyCollectionConfig, direction: value }),
            { secure: true, sameSite: "strict" }
        );

        setDirection(value);
    };

    const handleViewTypeChange = () => {
        const newValue = viewType == "Grid" ? "List" : "Grid";
        setCookie(
            "PropertyCollectionConfig",
            JSON.stringify({ ...cookie.PropertyCollectionConfig, viewType: newValue }),
            { secure: true, sameSite: "strict" }
        );

        setViewType(newValue);
    };

    const handleNewProp = async () => {
        await axios
            .post(
                `${import.meta.env.VITE_PROPERTY_API}/property`,
                {},
                { headers: { Authorization: `Bearer ${cookie.AccessToken}` } }
            )
            .then(({ data }) => {
                setLocation(`/property/${data.property.id}/edit`);
            })
            .catch(() => {
                showNotification({
                    title: "🚩 Unsuccessful Request",
                    message: "Could not create property, please try again later.",
                    color: "red"
                });
            });
    };

    return (
        <AuthWrapper requireAuth>
            <DashboardLayout>
                <Stack p={{ base: "sm", sm: "xl" }}>
                    <Flex align="center" gap="sm">
                        <Title order={3}>Properties</Title>
                        <div style={{ flex: 1 }} />
                        <Menu offset={4} position={"bottom-end"} closeOnItemClick={false}>
                            <Tooltip offset={4} position="bottom-end" label="Sort & Fiter">
                                <Menu.Target>
                                    <ActionIcon variant="default" className={classes.filterIcon} size="lg">
                                        <TbFilter />
                                    </ActionIcon>
                                </Menu.Target>
                            </Tooltip>
                            <Menu.Dropdown>
                                <Menu.Label>Sort by</Menu.Label>
                                {sortOptions.map(({ label, value }, i) => (
                                    <Menu.Item
                                        key={i}
                                        onClick={handleSortChange(value)}
                                        icon={sort == value ? <TbCheck /> : <div style={{ width: 14 }} />}
                                    >
                                        {label}
                                    </Menu.Item>
                                ))}

                                <Menu.Divider />

                                <Menu.Label>Sort direction</Menu.Label>
                                {directionOptions.map(({ label, value }, i) => (
                                    <Menu.Item
                                        key={i}
                                        onClick={handleDirectionChange(value)}
                                        icon={direction == value ? <TbCheck /> : <div style={{ width: 14 }} />}
                                    >
                                        {label}
                                    </Menu.Item>
                                ))}
                            </Menu.Dropdown>
                        </Menu>
                        <Tooltip label={`Switch to ${viewType == "Grid" ? "List" : "Grid"} view`} position="bottom-end">
                            <ActionIcon
                                size="lg"
                                variant="default"
                                onClick={handleViewTypeChange}
                                className={classes.filterIcon}
                            >
                                {viewType == "Grid" ? <TbLayoutGrid /> : <TbListDetails />}
                            </ActionIcon>
                        </Tooltip>
                    </Flex>
                    <Divider />
                    {isLoading ? (
                        <div className={classes.placeholderSection}>
                            <Loading withHeader={false} />
                        </div>
                    ) : isError ? (
                        <div className={classes.placeholderSection}>
                            <Center h="100%" style={{ flexDirection: "column", gap: 8 }}>
                                <ThemeIcon size="xl" radius="md" variant="light" color="gray">
                                    <TbWreckingBall size={22} />
                                </ThemeIcon>
                                <Text fw={600} inline ta="center">
                                    Oops, something went wrong...
                                </Text>
                                <Text size="sm" color="dimmed" ta="center" inline>
                                    Refresh the site to continue
                                </Text>
                            </Center>
                        </div>
                    ) : properties.length < 1 ? (
                        <div className={classes.placeholderSection}>
                            <Center h="100%" style={{ flexDirection: "column", gap: 8 }}>
                                <ThemeIcon size="xl" radius="md" variant="light" color="gray">
                                    <TbWreckingBall size={22} />
                                </ThemeIcon>
                                <Text fw={600} inline ta="center">
                                    Looks like you don't have any properties yet...
                                </Text>
                                <Button size="xs" variant="light" color="indigo" onClick={handleNewProp}>
                                    Create one now!
                                </Button>
                            </Center>
                        </div>
                    ) : (
                        <CollectionViewport properties={properties} viewType={viewType} setProperties={setProperties} />
                    )}
                </Stack>
            </DashboardLayout>
        </AuthWrapper>
    );
};

const CollectionViewport: FC<{
    properties: Property[];
    viewType: "List" | "Grid";
    setProperties: Dispatch<SetStateAction<Property[]>>;
}> = ({ properties, viewType, setProperties }) => {
    switch (viewType) {
        case "List":
            return <ListView properties={properties} setProperties={setProperties} />;
        case "Grid":
            return <GridView properties={properties} setProperties={setProperties} />;
        default:
            return <></>;
    }
};
