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
import { TbSun, TbMoonStars } from "react-icons/tb";
import { useLocation } from "wouter";
import { NavLinks } from "./NavLinks";
import { NavPropertyList } from "./NavPropertyList";

const useStyles = createStyles(theme => ({
    section: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.sm,
        padding: theme.spacing.sm,

        [`@media (width <= ${theme.breakpoints.sm}px)`]: {
            display: "none"
        }
    },
    row: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.md,
        padding: `${theme.spacing.xs - 4}px ${theme.spacing.sm}px`
    }
}));

export const DashboardNavbar: FC<{ opened: boolean }> = ({ opened }) => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ base: "100%", sm: 280 }}>
            <Navbar.Section className={classes.section}>
                <Group w="100%" align="center" position="apart">
                    <UnstyledButton className={classes.row} onClick={() => setLocation("/")}>
                        <ThemeIcon size="lg" radius="md" variant="default">
                            <MdOutlineCleaningServices />
                        </ThemeIcon>
                        <Title order={4} lineClamp={1}>
                            CleanCut
                        </Title>
                    </UnstyledButton>
                    <ActionIcon
                        onClick={() => toggleColorScheme()}
                        size="lg"
                        radius="md"
                        sx={theme => ({
                            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
                            color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6]
                        })}
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
