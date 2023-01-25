import { createStyles, Group, Navbar, Stack, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { useHover } from "@mantine/hooks";

import { FC } from "react";
import { IconType } from "react-icons/lib";
import { TbCalendarEvent, TbCurrencyDollar, TbHome2, TbSettings } from "react-icons/tb";
import { useLocation } from "wouter";

type Link = {
    icon: IconType;
    label: string;
    href: string;
};

const useStyles = createStyles(theme => ({
    section: {
        display: "flex",
        gap: theme.spacing.sm,
        flexDirection: "column",
        padding: theme.spacing.sm,
        borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`
    }
}));

const links: Link[] = [
    { icon: TbHome2, label: "Properties", href: "/" },
    { icon: TbCalendarEvent, label: "Bookings", href: "/bookings" },
    { icon: TbCurrencyDollar, label: "Billing", href: "/billing" },
    { icon: TbSettings, label: "Settings", href: "/settings" }
];

export const NavLinks: FC = () => {
    const { classes } = useStyles();

    return (
        <Navbar.Section className={classes.section}>
            <Stack spacing={6}>
                {links.map(link => (
                    <LinkButton link={link} key={link.href} />
                ))}
            </Stack>
        </Navbar.Section>
    );
};

type ButtonProps = {
    link: Link;
};

const buttonStyles = createStyles(theme => ({
    link: {
        width: "100%",
        transition: "0.2s ease",
        color: theme.colors.dark[2],
        borderRadius: theme.radius.md,
        padding: `${theme.spacing.xs - 4}px ${theme.spacing.sm}px`,

        "&:hover": {
            color: theme.colorScheme === "dark" ? "white" : "black",
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
        },

        "&:active": {
            color: theme.colorScheme === "dark" ? "white" : "black",
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[1]
        }
    },
    linkInner: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs
    },
    hovered: {
        color: theme.colorScheme === "dark" ? "white" : "black",
        transition: "0.2s ease"
    },
    unhover: {
        color: theme.colors.dark[2],
        transition: "0.2s ease"
    }
}));

export const LinkButton: FC<ButtonProps> = ({ link }) => {
    const { classes } = buttonStyles();
    const [location, setLocation] = useLocation();
    const { hovered, ref } = useHover<HTMLButtonElement>();

    const handleClick = () => setLocation(link.href);

    return (
        <UnstyledButton ref={ref} onClick={handleClick} className={classes.link}>
            <Group>
                <ThemeIcon size={"md"} radius={"md"} color={"gray"} variant={"light"}>
                    <link.icon
                        size={16}
                        className={location == link.href || hovered ? classes.hovered : classes.unhover}
                    />
                </ThemeIcon>

                <Text size={"xs"} weight={500} lineClamp={1}>
                    {link.label}
                </Text>
            </Group>
        </UnstyledButton>
    );
};
