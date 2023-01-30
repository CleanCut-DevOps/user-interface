import {
    ActionIcon,
    createStyles,
    Group,
    Navbar,
    ThemeIcon,
    Title,
    UnstyledButton,
    useMantineColorScheme
} from "@mantine/core";

import { FC } from "react";
import { MdOutlineCleaningServices } from "react-icons/md";
import { TbMoonStars, TbSun } from "react-icons/tb";
import { useLocation } from "wouter";

import { NavLinks } from "./NavLinks";
import { NavPropertyList } from "./NavPropertyList";

const useStyles = createStyles(theme => ({
    root: {
        display: "none",

        [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            display: "flex"
        }
    },
    open: { display: "flex" },
    section: {
        display: "none",
        alignItems: "center",
        gap: theme.spacing.sm,
        padding: theme.spacing.sm,

        [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            display: "flex"
        }
    },
    row: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.md,
        padding: `${theme.spacing.xs - 4}px ${theme.spacing.sm}px`
    },
    icon: {
        color: theme.colorScheme === "dark" ? theme.colors.indigo[4] : theme.colors.indigo[9]
    },
    toggleIcon: {   
        color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6]
    }
}));

export const DashboardNavbar: FC<{ opened: boolean }> = ({ opened }) => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <Navbar
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 280 }}
            className={`${classes.root} ${opened && classes.open}`}
        >
            <Navbar.Section className={classes.section}>
                <Group w="100%" align="center" position="apart">
                    <UnstyledButton className={classes.row} onClick={() => setLocation("/")}>
                        <ThemeIcon size="md" radius="md" variant="light" color="gray">
                            <MdOutlineCleaningServices size={12} className={classes.icon} />
                        </ThemeIcon>
                        <Title order={4} lineClamp={1}>
                            CleanCut
                        </Title>
                    </UnstyledButton>
                    <ActionIcon
                        size="md"
                        radius="sm"
                        variant="default"
                        onClick={() => toggleColorScheme()}
                        className={classes.toggleIcon}
                    >
                        {colorScheme === "dark" ? <TbSun /> : <TbMoonStars />}
                    </ActionIcon>
                </Group>
            </Navbar.Section>
            <NavLinks />
            <NavPropertyList />
        </Navbar>
    );
};
