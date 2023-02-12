import { createStyles, Group, Paper, Progress, SimpleGrid, Stack, Text, useMantineTheme } from "@mantine/core";

import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbHome2 } from "react-icons/tb";

import { useProperties } from "~/hooks";
import { convertResponseToProperty, Property } from "~/models";

type Stats = {
    incomplete: number;
    unverified: number;
    active: number;
    total: number;
};

const usePropertyStyles = createStyles(theme => ({
    statsCardIcon: {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
    },
    stat: {
        color: theme.colorScheme == "dark" ? "white" : "black",
        fontWeight: theme.colorScheme == "dark" ? 600 : 700
    },
    incomplete: { color: theme.colors.red[6] },
    unverified: { color: theme.colors.yellow[6] },
    active: { color: theme.colors.teal[6] }
}));

export const PropertyStats: FC = () => {
    const { colors } = useMantineTheme();
    const { classes } = usePropertyStyles();
    const [cookie] = useCookies(["AccessToken"]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        active: 0,
        incomplete: 0,
        unverified: 0
    });

    const { data } = useProperties(cookie.AccessToken);

    useEffect(() => {
        if (data) {
            let active = 0;

            const newProp: Property[] = data.properties.map((p: any) => {
                return convertResponseToProperty(p);
            });

            newProp.forEach(p => {
                axios
                    .get(`${import.meta.env.VITE_BOOKING_API}/bookings/${p.id}`, {
                        headers: { Authorization: `Bearer ${cookie.AccessToken}` }
                    })
                    .then(({ data: { bookings } }) => (active += bookings && bookings.length > 0 ? 1 : 0));
            });

            const incomplete = newProp.filter(
                p =>
                    p.icon == null ||
                    p.label == null ||
                    p.address.line_1 == null ||
                    p.address.city == null ||
                    p.address.zip == null ||
                    p.type == null ||
                    p.user_id == null ||
                    p.rooms.length < 0
            ).length;

            setStats({
                active,
                incomplete,
                total: newProp.length,
                unverified: newProp.filter((property: Property) => property.verified_at == null).length
            });
        }
    }, [data]);

    return (
        <Paper withBorder p="md" radius="md">
            <Group position="apart">
                <Text size="md" weight={600}>
                    Properties overview
                </Text>
                <TbHome2 size={16} className={classes.statsCardIcon} />
            </Group>
            <SimpleGrid mt="lg" cols={3} breakpoints={[{ maxWidth: "lg", cols: 1 }]}>
                <Stack spacing={0}>
                    <Text mb={8} transform="uppercase" size="xs" color="dimmed" weight={700}>
                        Incomplete
                    </Text>

                    <Group position="apart" align="flex-end" spacing={0}>
                        <Text weight={700} className={classes.incomplete}>
                            {stats.incomplete}
                        </Text>
                        <Text size="xs" weight={600} className={classes.stat}>
                            / {stats.total}
                        </Text>
                    </Group>
                    <Progress
                        size="xs"
                        value={(stats.incomplete / stats.total) * 100}
                        color={colors.red[6]}
                        styles={{ bar: { transitionDuration: "200ms", transitionTimingFunction: "ease" } }}
                    />
                </Stack>
                <Stack spacing={0}>
                    <Text mb={8} transform="uppercase" size="xs" color="dimmed" weight={700}>
                        Unverified
                    </Text>

                    <Group position="apart" align="flex-end" spacing={0}>
                        <Text weight={700} className={classes.unverified}>
                            {stats.unverified}
                        </Text>
                        <Text size="xs" weight={600} className={classes.stat}>
                            / {stats.total}
                        </Text>
                    </Group>
                    <Progress
                        size="xs"
                        value={(stats.unverified / stats.total) * 100}
                        color={colors.yellow[6]}
                        styles={{ bar: { transitionDuration: "200ms", transitionTimingFunction: "ease" } }}
                    />
                </Stack>
                <Stack spacing={0}>
                    <Text mb={8} transform="uppercase" size="xs" color="dimmed" weight={700}>
                        Active
                    </Text>

                    <Group position="apart" align="flex-end" spacing={0}>
                        <Text weight={700} className={classes.active}>
                            {stats.active}
                        </Text>
                        <Text size="xs" weight={600} className={classes.stat}>
                            / {stats.total}
                        </Text>
                    </Group>
                    <Progress
                        size="xs"
                        value={(stats.active / stats.total) * 100}
                        color={colors.teal[6]}
                        styles={{ bar: { transitionDuration: "200ms", transitionTimingFunction: "ease" } }}
                    />
                </Stack>
            </SimpleGrid>
        </Paper>
    );
};
