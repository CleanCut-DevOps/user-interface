import { createStyles, Group, Navbar, ThemeIcon, Title, UnstyledButton } from "@mantine/core";
import { FC } from "react";
import { MdOutlineCleaningServices } from "react-icons/md";
import { useLocation } from "wouter";
import { NavLinks } from "./NavLinks";
import { NavPropertyList } from "./NavPropertyList";

const useStyles = createStyles(theme => ({
    navbar: {
        transition: "0.4s ease"
    },
    section: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.sm,
        padding: theme.spacing.sm
    },
    button: {
        width: "100%",
        transition: "0.2s ease",
        borderRadius: theme.radius.md,
        padding: `${theme.spacing.xs - 4}px ${theme.spacing.sm}px`,

        "&:hover": { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
        "&:active": { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[1] }
    }
}));

export const DashboardNavbar: FC = () => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();

    return (
        <Navbar className={classes.navbar} width={{ base: 280 }}>
            <Navbar.Section className={classes.section}>
                <UnstyledButton className={classes.button}>
                    <Group align={"center"}>
                        <ThemeIcon size={"lg"} color={"indigo"} radius={"md"} variant={"light"}>
                            <MdOutlineCleaningServices />
                        </ThemeIcon>
                        <Title order={4} lineClamp={1}>
                            CleanCut
                        </Title>
                    </Group>
                </UnstyledButton>
            </Navbar.Section>
            <NavLinks />
            <NavPropertyList />
        </Navbar>
    );
};
