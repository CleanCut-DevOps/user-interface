import { Box, createStyles, Flex } from "@mantine/core";
import { FC } from "react";
import { AuthWrapper, Loading } from "../../../../components";
import { Additional } from "./components/Additional";
import { Address } from "./components/Address";
import { Details } from "./components/Details";
import { Header } from "./components/Header";
import {
    EditPropertyContext,
    EditPropertyProvider
} from "./components/Provider";
import { Rooms } from "./components/Rooms";
import { Sidebar } from "./components/Sidebar";
import { Type } from "./components/Type";

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
                            <EditPropertyContext.Consumer>
                                {({ step }) => {
                                    if (step === 0) return <Details />;
                                    if (step === 1) return <Address />;
                                    if (step === 2) return <Type />;
                                    if (step === 3) return <Rooms />;
                                    if (step === 4) return <Additional />;
                                    if (step === 5) return <Loading />;
                                }}
                            </EditPropertyContext.Consumer>
                        </Box>
                        <Sidebar />
                    </Flex>
                </Flex>
            </EditPropertyProvider>
        </AuthWrapper>
    );
};
