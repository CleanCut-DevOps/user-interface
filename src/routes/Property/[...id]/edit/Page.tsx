import { Box, createStyles, Flex, ScrollArea } from "@mantine/core";
import axios from "axios";
import { FC } from "react";
import { useQuery } from "react-query";
import { AuthWrapper, Loading } from "../../../../components";
import { PropertyType, RoomType } from "../../../../models";
import { Address } from "./Address";
import { EditPropertyContext, EditPropertyProvider, Header, Sidebar } from "./components";
import { Details } from "./Details";
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
        paddingInline: theme.spacing.xs
    },
    scrollarea: {
        height: "100%"
    }
}));

const fetchPropertyTypes = async () => {
    const res = await axios
        .get(`${import.meta.env.VITE_PROPERTY_API}/type/property?withRooms=true`)
        .then(({ data }) => {
            data.propertyTypes.forEach((propertyType: any) => {
                propertyType.created_at = new Date(propertyType.created_at * 1000);
                propertyType.updated_at = new Date(propertyType.updated_at * 1000);

                propertyType.rooms?.forEach((room: any) => {
                    room.created_at = new Date(room.created_at * 1000);
                    room.updated_at = new Date(room.updated_at * 1000);
                });
            });

            return data.propertyTypes as PropertyType[];
        });

    return res;
};

export const EditProperty: FC<RouteProps> = ({ params }) => {
    const { id } = params;
    const { data, isLoading, isError, isSuccess } = useQuery("property-types", fetchPropertyTypes);
    const { classes } = useStyles();

    return (
        <AuthWrapper requireAuth>
            <EditPropertyProvider id={id}>
                <Flex className={classes.column}>
                    <Header />
                    <Flex className={classes.grow}>
                        <Box className={classes.main}>
                            <ScrollArea className={classes.scrollarea} scrollbarSize={6}>
                                <EditPropertyContext.Consumer>
                                    {({ step }) => {
                                        if (step === 0) return <Details />;
                                        if (step === 1) return <Address />;
                                        if (step === 2)
                                            return <Type pType={{ data: data ?? [], isLoading, isError, isSuccess }} />;
                                        return <Loading />;
                                    }}
                                </EditPropertyContext.Consumer>
                            </ScrollArea>
                        </Box>
                        <Sidebar />
                    </Flex>
                </Flex>
            </EditPropertyProvider>
        </AuthWrapper>
    );
};
