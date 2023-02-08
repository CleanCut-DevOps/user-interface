import { Button, createStyles, Divider, Flex, Menu, SimpleGrid, Stack, Text } from "@mantine/core";

import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import { TbArrowsSort, TbCalendarTime, TbLetterCase } from "react-icons/tb";
import { useLocation } from "wouter";

import { AuthWrapper, DashboardLayout } from "~/components";

import { BookingStats } from "./components/BookingStats";
import { GridView } from "./components/Grid";
import { PropertyStats } from "./components/PropertyStats";

const sortOptions = [
    { label: "Alphabetical", value: "alphabetical", icon: <TbLetterCase /> },
    { label: "Last Created", value: "created", icon: <TbCalendarTime /> },
    { label: "Last modified", value: "updated", icon: <TbCalendarTime /> }
];

const useStyles = createStyles(theme => ({
    statsCardIcon: {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
    },
    stat: {
        color: theme.colorScheme == "dark" ? "white" : "black",
        fontWeight: theme.colorScheme == "dark" ? 600 : 700
    },
    incomplete: { color: theme.colorScheme == "dark" ? theme.colors.red[8] : theme.colors.red[5] },
    unverified: { color: theme.colorScheme == "dark" ? theme.colors.yellow[8] : theme.colors.yellow[5] }
}));

export const PropertyCollection: FC = () => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const [cookies, setCookies] = useCookies(["AccessToken", "PropertyCollectionConfig"]);

    const [sort, setSort] = useState<"alphabetical" | "created" | "updated">(
        cookies.PropertyCollectionConfig?.sort ?? "alphabetical"
    );

    const handleSortChange = (value: string) => () => {
        setCookies("PropertyCollectionConfig", JSON.stringify({ ...cookies.PropertyCollectionConfig, sort: value }), {
            secure: true,
            sameSite: "strict"
        });

        setSort(value as "alphabetical" | "created" | "updated");
    };

    return (
        <AuthWrapper requireAuth>
            <DashboardLayout>
                <Stack p={{ base: "sm", sm: "xl" }}>
                    <SimpleGrid cols={2} breakpoints={[{ maxWidth: "xs", cols: 1 }]}>
                        <PropertyStats />
                        <BookingStats />
                    </SimpleGrid>
                    <Stack>
                        <Flex align="center" gap="sm">
                            <Text weight={500} size="xl">
                                Your Properties
                            </Text>
                            <div style={{ flex: 1 }} />
                            <Menu width={200} offset={8} position={"bottom-end"} closeOnItemClick={false}>
                                <Menu.Target>
                                    <Button variant="default" size="sm" leftIcon={<TbArrowsSort />}>
                                        Sort
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown sx={theme => ({ boxShadow: theme.shadows.xs })}>
                                    <Menu.Label>Sort by</Menu.Label>
                                    {sortOptions.map(({ label, value, icon }, i) => (
                                        <Menu.Item
                                            key={i}
                                            onClick={handleSortChange(value)}
                                            icon={icon}
                                            sx={theme => ({
                                                transition: "0.2s ease",
                                                backgroundColor:
                                                    sort == value
                                                        ? theme.colorScheme == "dark"
                                                            ? theme.colors.dark[4]
                                                            : theme.colors.gray[2]
                                                        : undefined,

                                                ":hover": {
                                                    backgroundColor:
                                                        theme.colorScheme == "dark"
                                                            ? theme.colors.dark[5]
                                                            : theme.colors.gray[0]
                                                }
                                            })}
                                        >
                                            {label}
                                        </Menu.Item>
                                    ))}
                                </Menu.Dropdown>
                            </Menu>
                        </Flex>
                        <Divider />
                        <GridView sort={sort} />
                    </Stack>
                </Stack>
            </DashboardLayout>
        </AuthWrapper>
    );
};
