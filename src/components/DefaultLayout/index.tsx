import { AppShell, MantineTheme } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import { LayoutNavbar } from "./Navbar";

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
    const styles = (theme: MantineTheme) => ({
        main: {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0]
        }
    });

    return (
        <AppShell
            layout={"alt"}
            padding={"md"}
            styles={styles}
            navbar={<LayoutNavbar />}
            navbarOffsetBreakpoint={"lg"}
        >
            {children}
        </AppShell>
    );
};
