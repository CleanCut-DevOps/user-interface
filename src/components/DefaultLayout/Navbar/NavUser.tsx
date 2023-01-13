import { Avatar, createStyles, Group, Navbar, Text, UnstyledButton } from "@mantine/core";
import { FC, useContext } from "react";
import { UserContext } from "../../UserProvider";

const useStyles = createStyles(theme => ({
    section: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.sm,
        padding: theme.spacing.sm
    },
    button: {
        flex: 1,
        height: 38,
        flexGrow: 1,
        width: "100%",
        display: "block",
        overflow: "hidden",
        transition: "0.2s ease",
        borderRadius: theme.radius.md,
        padding: `${theme.spacing.xs - 4}px ${theme.spacing.sm}px`,
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : "black",

        "&:hover": { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
        "&:active": { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[1] }
    },
    text: {
        flex: 1,
        width: "100%",
        fontWeight: 500,
        transition: "0.2s ease",
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === "dark" ? "white" : "dark"
    }
}));

export const NavUser: FC = () => {
    const { user } = useContext(UserContext);
    const { classes } = useStyles();

    return (
        <Navbar.Section className={classes.section}>
            <UnstyledButton className={classes.button}>
                <Group>
                    <Avatar src={user?.avatar} size={"sm"} radius={"xl"} variant={"filled"} alt={"User avatar"} />
                    <Text lineClamp={1} className={classes.text}>
                        {user?.username ?? ""}
                    </Text>
                </Group>
            </UnstyledButton>
        </Navbar.Section>
    );
};
