import {
    ActionIcon,
    Avatar,
    createStyles,
    Group,
    Navbar,
    Text,
    UnstyledButton
} from "@mantine/core";
import { FC, useContext } from "react";
import { TbChevronRight } from "react-icons/tb";
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
        flexGrow: 1,
        width: "100%",
        height: 38,
        display: "block",
        padding: `${theme.spacing.xs - 4}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.md,
        transition: "0.2s ease",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : "black",
        overflow: "hidden",

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
    text: {
        color: theme.colorScheme === "dark" ? "white" : "dark",
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
        flex: 1,
        width: "100%",
        transition: "0.2s ease"
    }
}));

export const NavUser: FC = () => {
    const { user } = useContext(UserContext);
    const { classes } = useStyles();

    return (
        <Navbar.Section className={classes.section}>
            <UnstyledButton className={classes.button}>
                <Group>
                    <Avatar
                        src={user?.avatar}
                        size={"sm"}
                        radius={"xl"}
                        variant={"filled"}
                        alt={"User avatar"}
                    />
                    <Text lineClamp={1} className={classes.text}>
                        {user?.username ?? ""}
                    </Text>
                </Group>
            </UnstyledButton>
        </Navbar.Section>
    );
};
