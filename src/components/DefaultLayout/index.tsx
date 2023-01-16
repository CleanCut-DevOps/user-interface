import { AppShell, Container, createStyles } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import { LayoutNavbar } from "./Navbar";

const useStyles = createStyles(theme => ({
    main: {
        height: "100vh",
        overflow: "hidden"
    },
    root: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
    const { classes } = useStyles();

    return (
        <AppShell layout={"alt"} padding={"md"} classNames={classes} navbar={<LayoutNavbar />}>
            <Container size={"xl"} style={{ height: "100%" }}>
                {children}
            </Container>
        </AppShell>
    );
};
