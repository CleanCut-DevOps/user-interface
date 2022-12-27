import {
    createStyles,
    Group,
    Navbar,
    Stack,
    Text,
    ThemeIcon,
    UnstyledButton
} from "@mantine/core";
import { FC } from "react";
import { IconType } from "react-icons/lib";
import {
    TbCalendarEvent,
    TbHome2,
    TbLayoutDashboard,
    TbSettings
} from "react-icons/tb";
import { useLocation } from "wouter";

type Link = {
    icon: IconType;
    label: string;
    href: string;
};

const useStyles = createStyles(theme => ({
    section: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.sm,
        padding: theme.spacing.sm,

        borderBottom: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[3]
        }`
    },
    link: {
        width: "100%",
        transition: "0.2s ease",
        padding: `${theme.spacing.xs - 4}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.md,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[1]
                : theme.colors.dark[8],

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0]
        },

        "&:active": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[1]
        }
    },
    active: {
        color: "white !important"
    },
    linkInner: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs
    }
}));

const links: Link[] = [
    {
        icon: TbLayoutDashboard,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: TbHome2,
        label: "Properties",
        href: "/properties"
    },
    {
        icon: TbCalendarEvent,
        label: "Bookings",
        href: "/bookings"
    },
    {
        icon: TbSettings,
        label: "Settings",
        href: "/settings"
    }
];

export const NavLinks: FC = () => {
    const { classes } = useStyles();
    const [location, setLocation] = useLocation();

    const handleClick = (href: string) => () => setLocation(href);

    return (
        <Navbar.Section className={classes.section}>
            <Stack spacing={6}>
                {links.map(link => (
                    <UnstyledButton
                        key={link.href}
                        className={`${classes.link} ${
                            location == link.href ? classes.active : ""
                        }`}
                        onClick={handleClick(link.href)}
                    >
                        <Group>
                            <ThemeIcon
                                size={"md"}
                                radius={"md"}
                                color={"gray"}
                                variant={"light"}
                            >
                                <link.icon size={16} />
                            </ThemeIcon>

                            <Text size={"xs"} weight={500} lineClamp={1}>
                                {link.label}
                            </Text>
                        </Group>
                    </UnstyledButton>
                ))}
            </Stack>
        </Navbar.Section>
    );
};
