import {
    ActionIcon,
    createStyles,
    Group,
    Navbar,
    Text,
    Tooltip
} from "@mantine/core";
import axios from "axios";
import { FC } from "react";
import { useCookies } from "react-cookie";
import { TbPlus } from "react-icons/tb";
import { useQuery } from "react-query";
import { useLocation } from "wouter";

const useStyles = createStyles(theme => ({
    section: {
        height: "100%",
        display: "flex",
        overflow: "hidden",
        flex: "1 !important",
        gap: theme.spacing.sm,
        flexDirection: "column",
        padding: theme.spacing.sm
    },
    header: {
        padding: `0 ${theme.spacing.sm}px}`
    }
}));

export const NavPropertyList: FC = () => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();

    const handleClick = () => {
        setLocation("/create/property");
    };

    return (
        <Navbar.Section className={classes.section}>
            <Group className={classes.header} position="apart">
                <Text size="xs" weight={500} color="dimmed">
                    Your properties
                </Text>
                <Tooltip
                    fz={12}
                    withArrow
                    position="right"
                    label="Create property"
                >
                    <ActionIcon
                        size={18}
                        variant={"filled"}
                        onClick={handleClick}
                    >
                        <TbPlus size={12} />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Navbar.Section>
    );
};
