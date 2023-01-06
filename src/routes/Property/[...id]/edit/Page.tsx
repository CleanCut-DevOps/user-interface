import { Box, createStyles, Flex } from "@mantine/core";
import { FC } from "react";
import { AuthWrapper, Loading } from "../../../../components";
import { Additional } from "./Additional";
import { Address } from "./Address";
import {
    EditPropertyContext,
    EditPropertyProvider,
    Header,
    Sidebar
} from "./components";
import { Details } from "./Details";
import { Rooms } from "./Rooms";
import { Type } from "./Type";

type RouteProps = { params: { id: string } };

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
        overflow: "hidden",
        padding: theme.spacing.xl
    }
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
                        <Box className={classes.main}>
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
