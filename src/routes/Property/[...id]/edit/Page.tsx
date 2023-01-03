import { Box, createStyles, Flex } from "@mantine/core";
import { FC } from "react";
import { AuthWrapper } from "../../../../components";
import { Header } from "./components/Header";
import { EditPropertyProvider } from "./components/Provider";
import { Sidebar } from "./components/Sidebar";

type RouteProps = { params: { id: string } };

const useStyles = createStyles(theme => ({
    main: { padding: theme.spacing.xl },
    grow: { flex: 1 },
    column: { height: "100%", minHeight: "100vh", flexDirection: "column" }
}));

export const EditProperty: FC<RouteProps> = ({ params }) => {
    const { id } = params;
    const { classes } = useStyles();

    return (
        <AuthWrapper requireAuth>
            <EditPropertyProvider id={id}>
                <Flex className={classes.column}>
                    <Header />
                    <Flex className={classes.grow}>
                        <Box className={`${classes.main} ${classes.grow}`}>
                            asdasd
                        </Box>
                        <Sidebar />
                    </Flex>
                </Flex>
            </EditPropertyProvider>
        </AuthWrapper>
    );
};
