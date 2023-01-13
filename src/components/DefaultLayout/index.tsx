import { AppShell, createStyles } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import { LayoutNavbar } from "./Navbar";

const useStyles = createStyles(theme => ({
    main: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }
}));

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
    const { classes } = useStyles();

    return (
        <AppShell layout={"alt"} padding={"md"} className={classes.main} navbar={<LayoutNavbar />}>
            {children}
        </AppShell>
    );
};
