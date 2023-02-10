import { Button, createStyles, Divider, Flex, Group, Menu, SimpleGrid, Stack, Text, Title } from "@mantine/core";

import { FC, useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { TbArrowsSort, TbCalendarTime, TbHome2, TbLetterCase } from "react-icons/tb";

import { AuthWrapper, DashboardLayout, UserContext } from "~/components";

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
    const { user } = useContext(UserContext);
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
                <Stack pt="xl" spacing="xl" p={{ base: "sm", sm: "xl" }}>
                    <Stack spacing={8}>
                        <Title order={2} ff="Inter" inline>
                            Welcome back {user?.name} 👋
                        </Title>
                        <Group spacing={10}>
                            <TbHome2 /> <b>·</b> <Text>Properties</Text>
                        </Group>
                    </Stack>
                    <SimpleGrid cols={2} breakpoints={[{ maxWidth: "xs", cols: 1 }]}>
                        <PropertyStats />
                        <BookingStats />
                    </SimpleGrid>
                    <Stack spacing="sm">
                        <Flex align="center" gap="sm">
                            <Title order={4} ff="Inter" inline>
                                Your Properties
                            </Title>
                            <div style={{ flex: 1 }} />
                            <Menu width={200} offset={8} position={"bottom-end"} closeOnItemClick={false}>
                                <Menu.Target>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        compact
                                        pr="lg"
                                        pl="md"
                                        leftIcon={<TbArrowsSort />}
                                    >
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
