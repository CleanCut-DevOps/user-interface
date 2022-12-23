import {
    ActionIcon,
    Code,
    createStyles,
    Group,
    Navbar,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Title,
    Tooltip,
    UnstyledButton
} from "@mantine/core";
import {
    TbCalendarEvent,
    TbHome2,
    TbIcons,
    TbPlus,
    TbSearch,
    TbUser
} from "react-icons/tb";
import { UserButton } from "../UserButton";
import { FC, useContext } from "react";
import { UserContext } from "../../UserProvider";
import { PropertyList } from "./PropertyList";

const useStyles = createStyles(theme => ({
    navbar: {
        paddingTop: 0,
        height: "100vh",

        [`@media (max-width: ${theme.breakpoints.lg - 1}px)`]: {
            height: 72
        }
    },

    section: {
        padding: "0.5rem",
        marginBottom: theme.spacing.xs,

        "&:not(:last-of-type)": {
            borderBottom: `1px solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[3]
            }`
        }
    },

    expanded: {
        flex: "1 !important",
        overflow: "hidden"
    },

    searchCode: {
        fontWeight: 700,
        fontSize: 10,
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[7]
                : theme.colors.gray[0],
        border: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[7]
                : theme.colors.gray[2]
        }`
    },

    mainLink: {
        width: "100%",
        padding: `8px`,
        display: "flex",
        fontWeight: 500,
        alignItems: "center",
        transition: "0.2s ease",
        fontSize: theme.fontSizes.sm,
        borderRadius: theme.radius.md,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[6],

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
            color: theme.colorScheme === "dark" ? theme.white : theme.black
        }
    },

    mainLinkInner: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs
    },

    listWrapper: {
        flex: 1
    },

    listHeader: {
        paddingLeft: theme.spacing.md + 2,
        paddingRight: theme.spacing.md,
        marginBottom: 5
    }
}));

const links = [
    { icon: TbHome2, label: "Dashboard", color: "blue" },
    { icon: TbCalendarEvent, label: "Bookings", color: "teal" },
    { icon: TbUser, label: "Feedback", color: "violet" }
];

export const LayoutNavbar: FC = () => {
    const { user } = useContext(UserContext);
    const { classes } = useStyles();

    const mainLinks = links.map(link => (
        <UnstyledButton key={link.label} className={classes.mainLink}>
            <div className={classes.mainLinkInner}>
                <ThemeIcon size={"lg"} color={link.color} variant="light">
                    <link.icon size={16} />
                </ThemeIcon>

                <span>{link.label}</span>
            </div>
        </UnstyledButton>
    ));

    return (
        <Navbar
            width={{ base: 72, sm: 300 }}
            height={"100%"}
            hidden={true}
            hiddenBreakpoint={"lg"}
            className={classes.navbar}
        >
            <Navbar.Section className={classes.section}>
                <Group style={{ padding: "0.5rem" }}>
                    <TbIcons />
                    <Title order={5}>CleanCut</Title>
                </Group>
            </Navbar.Section>
            <Navbar.Section className={classes.section}>
                <TextInput
                    placeholder="Search"
                    icon={<TbSearch size={12} />}
                    rightSectionWidth={70}
                    rightSection={
                        <Code className={classes.searchCode}>Ctrl + K</Code>
                    }
                    styles={{ rightSection: { pointerEvents: "none" } }}
                    mb="sm"
                />
                {mainLinks}
            </Navbar.Section>

            <Navbar.Section
                className={`${classes.section} ${classes.expanded}`}
            >
                <Stack h={"100%"}>
                    <Group className={classes.listHeader} position="apart">
                        <Text size="xs" weight={500} color="dimmed">
                            Properties
                        </Text>
                        <Tooltip
                            label="Create property"
                            withArrow
                            position="right"
                        >
                            <ActionIcon variant="light" size={18}>
                                <TbPlus size={12} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                    <ScrollArea className={classes.listWrapper}>
                        <PropertyList />
                    </ScrollArea>
                </Stack>
            </Navbar.Section>

            <Navbar.Section className={classes.section}>
                <UserButton
                    image={user?.avatar}
                    name={user?.username ?? ""}
                    email={user?.email ?? ""}
                />
            </Navbar.Section>
        </Navbar>
    );
};
