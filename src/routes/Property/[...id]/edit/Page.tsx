import { AppShell, createStyles } from "@mantine/core";
import { FC } from "react";
import { AuthWrapper } from "../../../../components";
import { EditPropertyProvider } from "./components/Provider";
import { Sidebar } from "./components/Sidebar";

type RouteProps = { params: { id: string } };

const useStyles = createStyles(theme => ({
    main: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0]
    }
}));

export const EditProperty: FC<RouteProps> = ({ params }) => {
    const { id } = params;
    const { classes } = useStyles();

    return (
        <AuthWrapper requireAuth>
            <EditPropertyProvider id={id}>
                <AppShell
                    padding={"md"}
                    navbar={<Sidebar />}
                    className={classes.main}
                >
                    Edit Property
                </AppShell>
            </EditPropertyProvider>
        </AuthWrapper>
    );
};
