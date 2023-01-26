import {
    ActionIcon,
    Center,
    Checkbox,
    createStyles,
    Flex,
    NumberInput,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
    UnstyledButton
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbHandFinger, TbMinus, TbPlus, TbWreckingBall } from "react-icons/tb";
import { useLocation } from "wouter";

import { Loading } from "~/components";
import { PropertyType, RoomType } from "~/models";

import { EditPropertyContext } from "../../components/PropertyProvider";

type ComponentProps = {
    pType: { data: PropertyType[]; isLoading: boolean; error: boolean };
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

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { paddingInline: theme.spacing.xs }
    },
    container: {
        gap: theme.spacing.xl * 2,
        padding: 8,
        marginTop: 16,
        width: "100%",
        maxWidth: 768,
        display: "flex",
        flexDirection: "column",

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: { paddingTop: 8, padding: 0 }
    },
    label: {
        width: "100%",
        maxWidth: 768
    },
    labelGroup: {
        display: "flex",
        gap: theme.spacing.xs,
        flexDirection: "column",
        marginBottom: theme.spacing.xs
    },
    step: {
        fontSize: 16,
        fontWeight: 500
    },
    title: {
        fontSize: 32,
        fontWeight: 700,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { fontSize: 24 }
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 400,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { fontSize: 14 }
    }
}));

const useTypeButtonStyles = createStyles(theme => ({
    disabled: {
        width: "100%",
        display: "flex",
        gap: theme.spacing.md,
        transition: "0.2s ease",
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[4],
        border:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[4]}` : `1px solid ${theme.colors.gray[4]}`,

        "&:hover": {
            cursor: "default"
        }
    },
    button: {
        width: "100%",
        display: "flex",
        gap: theme.spacing.md,
        transition: "0.2s ease",
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white",
        border:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[4]}` : `1px solid ${theme.colors.gray[4]}`,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
        }
    }
}));

const useRoomStyles = createStyles(theme => ({
    wrapper: {
        display: "flex",
        gap: theme.spacing.xl * 2,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { gap: theme.spacing.xl }
    },
    buttonGroup: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        padding: `6px ${theme.spacing.xs}px`
    },
    group: {
        gap: 0,
        height: 48,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            alignItems: "start",
            flexDirection: "column"
        }
    },
    input: {
        width: 36,
        textAlign: "center",
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1]
    }
}));

export const Type: FC<ComponentProps> = ({ pType }) => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const { data, error, isLoading } = pType;
    const [cookies] = useCookies(["AccessToken"]);
    const { classes: typeButtonClasses } = useTypeButtonStyles();
    const { property, dispatch } = useContext(EditPropertyContext);

    useEffect(() => {
        if (data.length > 0) {
            data.forEach((propertyType: any) => {
                propertyType.created_at = new Date(propertyType.created_at * 1000);
                propertyType.updated_at = new Date(propertyType.updated_at * 1000);

                propertyType.rooms?.forEach((room: any) => {
                    room.created_at = new Date(room.created_at * 1000);
                    room.updated_at = new Date(room.updated_at * 1000);
                });
            });
        }
    }, [data]);

    const handleTypeChange = (type: PropertyType) => () => {
        if (cookies.AccessToken) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/property/${property?.id}/type`,
                { id: type.id },
                { headers: { Authorization: `Bearer ${cookies.AccessToken}` } }
            );

            dispatch({
                type: "type",
                payload: {
                    type,
                    rooms: type?.rooms?.map(roomType => ({
                        quantity: 0,
                        type: roomType,
                        updated_at: new Date()
                    }))
                }
            });
        } else {
            setLocation("/login");

            showNotification({
                color: "red",
                title: "No Access Token",
                message: "Please refresh the site and login to continue 🙂"
            });
        }
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.container}>
                <Stack spacing="sm">
                    <Title className={classes.step}>Step 3</Title>
                    <Title className={classes.title}>Share some basics about your place</Title>
                    <Text className={classes.subtitle} color={"dimmed"}>
                        In this step, you'll update the type of your property as well as how many rooms there are. Tell
                        us if it's a house, apartment, or something else.
                    </Text>
                </Stack>
                <Stack spacing="sm">
                    <Text fw={700} size="lg">
                        Which of these best describes your place?
                    </Text>
                    {isLoading ? (
                        <div style={{ height: 120 }}>
                            <Loading withHeader={false} />
                        </div>
                    ) : error ? (
                        <div style={{ height: 120 }}>
                            <Center h="100%" style={{ flexDirection: "column", gap: 8 }}>
                                <ThemeIcon size="xl" radius="md" variant="light" color="gray">
                                    <TbWreckingBall size={22} />
                                </ThemeIcon>
                                <Text fw={600} inline>
                                    Oops, something went wrong...
                                </Text>
                                <Text size="sm" color="dimmed" inline>
                                    Refresh the site to continue
                                </Text>
                            </Center>
                        </div>
                    ) : (
                        <SimpleGrid
                            w={"100%"}
                            cols={2}
                            spacing="sm"
                            breakpoints={[
                                { maxWidth: 980, cols: 2, spacing: "md", verticalSpacing: "md" },
                                { maxWidth: 755, cols: 2, spacing: "sm", verticalSpacing: "sm" },
                                { maxWidth: 600, cols: 1, spacing: "sm", verticalSpacing: "xs" }
                            ]}
                        >
                            {data.map(type => {
                                let selected = property?.type?.id == type.id;
                                let disabled = type.available == false;

                                return (
                                    <UnstyledButton
                                        key={type.id}
                                        className={disabled ? typeButtonClasses.disabled : typeButtonClasses.button}
                                        disabled={disabled}
                                        onClick={handleTypeChange(type)}
                                    >
                                        <Checkbox
                                            tabIndex={-1}
                                            checked={selected}
                                            disabled={disabled}
                                            onChange={() => {}}
                                            styles={{ input: { cursor: "pointer" } }}
                                        />
                                        <div>
                                            <Text
                                                weight={500}
                                                mb={7}
                                                sx={{ lineHeight: 1 }}
                                                color={disabled ? "dimmed" : undefined}
                                            >
                                                {type.label}
                                            </Text>
                                            <Text lineClamp={2} size={"sm"} color={"dimmed"}>
                                                {type.description}
                                            </Text>
                                        </div>
                                    </UnstyledButton>
                                );
                            })}
                        </SimpleGrid>
                    )}
                </Stack>
                <Stack spacing="sm">
                    <Text fw={700} size="lg">
                        How many rooms do you have
                    </Text>
                    {isLoading ? (
                        <div style={{ height: 120 }}>
                            <Loading withHeader={false} />
                        </div>
                    ) : error ? (
                        <div style={{ height: 120 }}>
                            <Center h="100%" style={{ flexDirection: "column", gap: 8 }}>
                                <ThemeIcon size="xl" radius="md" variant="light" color="gray">
                                    <TbWreckingBall size={22} />
                                </ThemeIcon>
                                <Text fw={600} inline>
                                    Oops, something went wrong...
                                </Text>
                                <Text size="sm" color="dimmed" inline>
                                    Refresh the site to continue
                                </Text>
                            </Center>
                        </div>
                    ) : !property?.type ? (
                        <div style={{ height: 120 }}>
                            <Center h="100%" style={{ gap: 8 }}>
                                <ThemeIcon size="xl" radius="md" variant="light" color="gray">
                                    <TbHandFinger size={22} />
                                </ThemeIcon>
                                <Text>Select a property type to continue</Text>
                            </Center>
                        </div>
                    ) : (
                        data
                            .find(type => type.id == property?.type?.id)
                            ?.rooms?.map(room => <RoomQuantityEditor room={room} key={room.id} />)
                    )}
                </Stack>
            </div>
        </div>
    );
};

const RoomQuantityEditor: FC<{ room: RoomType }> = ({ room }) => {
    const { classes: roomClasses } = useRoomStyles();
    const [cookies] = useCookies(["AccessToken"]);
    const { property, dispatch } = useContext(EditPropertyContext);

    const [loaded, setLoaded] = useState(false);
    const [value, setValue] = useState(property?.rooms?.find(r => r.type.id === room.id)?.quantity ?? 0);

    const [debouncedValue] = useDebouncedValue(value, 500);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/property/${property?.id}/rooms`,
                { id: room.id, quantity: debouncedValue },
                { headers: { Authorization: `Bearer ${cookies.AccessToken}` } }
            );
        } else setLoaded(true);
    }, [debouncedValue]);

    const handleClick = (type: "increment" | "decrement") => () => {
        const newRooms = [...(property?.rooms ?? [])];
        const index = newRooms.findIndex(r => r.type.id === room.id);

        switch (type) {
            case "increment":
                if (index > -1) newRooms[index].quantity = value < 22 ? value + 1 : value;

                setValue(value < 22 ? value + 1 : value);
                break;
            case "decrement":
                if (index > -1) newRooms[index].quantity = value > 0 ? value - 1 : value;

                setValue(value > 0 ? value - 1 : value);
                break;
        }

        dispatch({ type: "type", payload: { rooms: newRooms } });
    };

    const handleChange = (newVal: number) => {
        setValue(newVal);
    };

    return (
        <Paper p="sm" radius="sm" withBorder className={roomClasses.wrapper}>
            <Flex className={roomClasses.group}>
                <Text size="sm" fw={500}>
                    {room.label}
                </Text>
                <Text size="sm" color="dimmed">
                    {room.price.toFixed(2)}/unit
                </Text>
            </Flex>
            <Center>
                <div className={roomClasses.buttonGroup}>
                    <ActionIcon onClick={handleClick("decrement")}>
                        <TbMinus />
                    </ActionIcon>
                    <NumberInput
                        min={0}
                        max={22}
                        value={property?.rooms?.find(r => r.type.id === room.id)?.quantity}
                        variant="unstyled"
                        classNames={{ input: roomClasses.input }}
                        onChange={handleChange}
                    />
                    <ActionIcon onClick={handleClick("increment")}>
                        <TbPlus />
                    </ActionIcon>
                </div>
            </Center>
        </Paper>
    );
};
