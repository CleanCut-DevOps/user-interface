import { AppShell, createStyles, ScrollArea } from "@mantine/core";

import { FC } from "react";

import { AuthWrapper } from "~/components";

import { EditPropertyProvider } from "../components/PropertyProvider";
import { EditAside } from "./components/Aside";
import { EditHeader } from "./components/Header";

type ComponentProps = { params: { id: string } };

const useStyles = createStyles(theme => ({
    grow: {
        flex: 1,
        height: "100%",
        width: "100vw",
        overflow: "hidden",
        flexDirection: "row"
    },
    column: {
        height: "100vh",
        overflow: "hidden",
        flexDirection: "column"
    },
    main: {
        flex: 1,
        width: "100%",
        height: "100%",
        paddingInline: theme.spacing.xs
    },
    scrollarea: {
        height: "100%"
    }
}));

export const EditProperty: FC<ComponentProps> = ({ params: { id } }) => {
    const { classes } = useStyles();

    return (
        <AuthWrapper requireAuth>
            <EditPropertyProvider id={id}>
                <AppShell
                    padding={0}
                    header={<EditHeader />}
                    aside={<EditAside />}
                    asideOffsetBreakpoint="md"
                    styles={{ main: { height: "100vh", overflow: "hidden" } }}
                >
                    <ScrollArea h="100%" scrollbarSize={6}>
                        {[...new Array(100).keys()].map(k => (
                            <div key={k}>app {k}</div>
                        ))}
                    </ScrollArea>
                </AppShell>
            </EditPropertyProvider>
        </AuthWrapper>
    );
};
