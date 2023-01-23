import { AppShell, Container, createStyles } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import { DashboardNavbar } from "./Navbar";

const useStyles = createStyles({
    main: {
        height: "100vh",
        overflow: "hidden"
    }
});

export const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
    const { classes } = useStyles();

    return (
        <AppShell layout={"alt"} padding={"md"} classNames={classes} navbar={<DashboardNavbar />}>
            <Container mt={"xl"} size={"xl"} style={{ height: "100%" }}>
                {children}
            </Container>
        </AppShell>
    );
};
