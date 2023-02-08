import { createStyles, Group, Paper, Text, useMantineTheme } from "@mantine/core";

import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import { TbCalendarEvent } from "react-icons/tb";

type Stats = {
    active: number;
    upcoming: number;
    rejected: number;
    total: number;
};

const useBookingStyles = createStyles(theme => ({
    statsCardIcon: {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
    },
    stat: {
        color: theme.colorScheme == "dark" ? "white" : "black",
        fontWeight: theme.colorScheme == "dark" ? 600 : 700
    }
}));

export const BookingStats: FC = () => {
    const { colorScheme, colors } = useMantineTheme();
    const { classes } = useBookingStyles();
    const [cookie] = useCookies(["AccessToken"]);
    const [stats, setStats] = useState<Stats>({
        active: 0,
        upcoming: 0,
        rejected: 0,
        total: 0
    });

    return (
        <Paper withBorder p="md" radius="md">
            <Group position="apart">
                <Text size="md" weight={600}>
                    Bookings overview
                </Text>
                <TbCalendarEvent size={16} className={classes.statsCardIcon} />
            </Group>
        </Paper>
    );
};
