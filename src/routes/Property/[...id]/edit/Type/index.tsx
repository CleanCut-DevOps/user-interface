import { createStyles, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { PropertyType } from "../../../../../models";
import { EditPropertyContext } from "../components";
import { PropertyTypeSelector } from "./PropertyTypeSelector";
import { RoomQuantityEditors } from "./RoomQuantityEditor";

type ComponentProps = {
    pType: { data: PropertyType[]; isLoading: boolean; isError: boolean; isSuccess: boolean };
};

type Room = {
    type: {
        id: string;
        type_id: string;
        label: string;
        price: number;
        available: boolean;
        created_at: Date;
        updated_at: Date;
    };
    quantity: number;
    updated_at: Date;
};

const useStyles = createStyles(theme => ({
    wrapper: {
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.md,
        flexDirection: "column",
        padding: theme.spacing.lg,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { paddingInline: 4 }
    },
    labels: {
        width: "100%",
        maxWidth: 768,
        marginTop: 16,
        display: "flex",
        gap: theme.spacing.xs,
        flexDirection: "column",
        marginBottom: 2 * theme.spacing.xs
    },
    step: {
        fontSize: 16,
        fontWeight: 500
    },
    title: {
        fontSize: 32,
        fontWeight: 700,

        [`@media (max-width: 815px)`]: { fontSize: 24 }
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 400,

        [`@media (max-width: 815px)`]: { fontSize: 14 }
    }
}));

const fetchRoomTypes = (id: string) => async () => {
    const res = await axios
        .get(`${import.meta.env.VITE_PROPERTY_API}/type/property`)
        .then(({ data }) => data.roomTypes as PropertyType[]);

    return res;
};

export const Type: FC<ComponentProps> = ({ pType }) => {
    const { classes } = useStyles();
    const { isError: isError } = pType;
    const [cookies] = useCookies(["AccessToken"]);
    const { property, dispatch } = useContext(EditPropertyContext);

    const [type, setType] = useState({
        typeId: property?.type?.id ?? null,
        rooms: property?.rooms.map(raw => ({ id: raw.type.id, quantity: raw.quantity })) ?? []
    });

    const [typeDebounced] = useDebouncedValue(type, 2000);

    useEffect(() => {
        if (isError) {
            dispatch({ type: "previous" });

            showNotification({
                title: "No property types found",
                message: "An unexpected error occurred. Please try again later.",
                color: "red"
            });
        }
    }, [isError]);

    useEffect(() => {
        const setRData = async () => {
            await axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/property/${property?.id}/type`,
                { type_id: typeDebounced.typeId, rooms: typeDebounced.rooms },
                { headers: { Authorization: `Bearer ${cookies.AccessToken}` } }
            );
        };

        if (typeDebounced.typeId) setRData();
    }, [typeDebounced]);

    const handleTypeChange = (id: string) => () => {
        const newRooms = pType.data
            .find(type => type.id === id)
            ?.rooms?.map(room => ({
                id: room.id,
                quantity: 0
            }));

        setType({ typeId: id, rooms: newRooms ?? [] });
    };

    const handleRoomChange = (id: string, value: number) => () => {
        const newRooms = type.rooms.map(room => {
            if (room.id === id) return { id, quantity: value };
            else return room;
        });

        setType({ ...type, rooms: newRooms });
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.labels}>
                <Title className={classes.step}>Step 3</Title>
                <Title className={classes.title}>Share some basics about your place</Title>
                <Text maw={560} className={classes.subtitle} color={"dimmed"}>
                    In this step, you'll update the type of your property as well as how many rooms there are. Tell us
                    if it's a house, apartment, or something else.
                </Text>
            </div>
            <PropertyTypeSelector pType={pType} typeId={type.typeId} handleTypeChange={handleTypeChange} />
            <RoomQuantityEditors
                pType={pType}
                rooms={type.rooms}
                typeId={type.typeId}
                handleRoomChange={handleRoomChange}
            />
        </div>
    );
};
